import { singleton } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../../config/db.config';
import { Prisma } from '../../../generated/prisma/client.js';
import { UserRepositoryInterface } from './user.repository.interface';
import { UserSignUpRequest } from '../dtos/userSignUpRequest.dto';
import { UserUpdateProfileData } from '../dtos/userUpdateProfileRequest.dto';
import { AppError } from '../../../common/app-error';
import { USER_ERROR_CODE } from '../../../common/error-code';

@singleton()
export class UserRepository implements UserRepositoryInterface {
  public async addUser(data: UserSignUpRequest): Promise<bigint> {
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

      return created.id;
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

  public async getUser(userId: bigint) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deleted_at: null },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
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
    userId: bigint,
    foodCategoryId: bigint,
  ): Promise<void> {
    try {
      await prisma.user_favorite_food.create({
        data: {
          user_id: userId,
          food_category_id: foodCategoryId,
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

  public async getUserPreferencesByUserId(userId: bigint) {
    const rows = await prisma.user_favorite_food.findMany({
      where: { user_id: userId },
      include: { food_category: true },
      orderBy: { food_category_id: 'asc' },
    });

    return rows.map((r) => ({
      food_category_id: r.food_category_id,
      user_id: r.user_id,
      name: r.food_category?.name ?? null,
    }));
  }

  public async updateUser(
    userId: bigint,
    data: Omit<UserUpdateProfileData, 'preferences'>,
  ): Promise<void> {
    const result = await prisma.user.updateMany({
      where: { id: userId, deleted_at: null },
      data: {
        ...(data.name !== undefined && { nickname: data.name }),
        ...(data.gender !== undefined && { gender: data.gender }),
        ...(data.birth !== undefined && { birth: data.birth }),
        ...(data.phoneNumber !== undefined && {
          phone_number: data.phoneNumber,
        }),
        ...(data.address !== undefined && { address_doro: data.address }),
        ...(data.detailAddress !== undefined && {
          address_detail: data.detailAddress,
        }),
      },
    });

    if (result.count === 0) {
      throw new AppError(
        USER_ERROR_CODE.USER_NOT_FOUND,
        '존재하지 않는 사용자입니다.',
        StatusCodes.NOT_FOUND,
      );
    }
  }

  public async replacePreferences(
    userId: bigint,
    foodCategoryIds: bigint[],
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.user_favorite_food.deleteMany({
        where: { user_id: userId },
      });

      for (const foodCategoryId of foodCategoryIds) {
        try {
          await tx.user_favorite_food.create({
            data: {
              user_id: userId,
              food_category_id: foodCategoryId,
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
    });
  }
}
