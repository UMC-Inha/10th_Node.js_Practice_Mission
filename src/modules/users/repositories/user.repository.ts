import { singleton } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../../config/db.config';
import { Prisma } from '../../../generated/prisma/client.js';
import { UserRepositoryInterface } from './user.repository.interface';
import { UserSignUpRequest } from '../dtos/userSignUpRequest.dto';
import { AppError } from '../../../common/app-error';
import { USER_ERROR_CODE } from '../../../common/error-code';

@singleton()
export class UserRepository implements UserRepositoryInterface {
  public async addUser(data: UserSignUpRequest): Promise<number> {
    try {
      const created = await prisma.user.create({
        data: {
          nickname: data.name,
          gender: data.gender,
          birth: data.birth,
          email: data.email,
          social_id: data.socialId ?? `local:${data.email}`,
          phone_number: data.phoneNumber,
          address_doro: data.address ?? null,
          address_detail: data.detailAddress ?? null,
          created_at: new Date(),
        },
      });

      return Number(created.id);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new AppError(
          USER_ERROR_CODE.EMAIL_ALREADY_EXISTS,
          '이미 존재하는 이메일입니다.',
          StatusCodes.CONFLICT,
        );
      }
      throw e;
    }
  }

  public async getUser(userId: number) {
    const user = await prisma.user.findFirst({
      where: { id: BigInt(userId), deleted_at: null },
    });

    if (!user) {
      return null;
    }

    return {
      id: Number(user.id),
      email: user.email,
      name: user.nickname,
      gender: user.gender,
      birth: user.birth,
      address: user.address_doro ?? '',
      detailAddress: user.address_detail ?? '',
      phoneNumber: user.phone_number ?? '',
    };
  }

  public async setPreference(
    userId: number,
    foodCategoryId: number,
  ): Promise<void> {
    try {
      await prisma.user_favorite_food.create({
        data: {
          user_id: BigInt(userId),
          food_category_id: BigInt(foodCategoryId),
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new AppError(
          USER_ERROR_CODE.USER_ALREADY_EXISTS,
          '이미 등록된 선호 음식 카테고리입니다.',
          StatusCodes.CONFLICT,
        );
      }
      throw e;
    }
  }

  public async getUserPreferencesByUserId(userId: number) {
    const rows = await prisma.user_favorite_food.findMany({
      where: { user_id: BigInt(userId) },
      include: { food_category: true },
      orderBy: { food_category_id: 'asc' },
    });

    return rows.map((r) => ({
      food_category_id: Number(r.food_category_id),
      user_id: Number(r.user_id),
      name: r.food_category?.name ?? null,
    }));
  }
}
