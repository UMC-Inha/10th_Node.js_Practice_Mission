import { inject, singleton } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import { UserSignUpRequest } from '../dtos/userSignUpRequest.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { AppError } from '../../../common/app-error';
import { USER_ERROR_CODE } from '../../../common/error-code';
import { prisma } from '../../../config/db.config';

@singleton()
export class UserService {
  constructor(
    @inject(UserRepository)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async userSignUp(data: UserSignUpRequest) {
    const categoryIds = [...new Set(data.preferences)];
    const found = await prisma.food_category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true },
    });

    if (found.length !== categoryIds.length) {
      throw new AppError(
        USER_ERROR_CODE.INVALID_FOOD_CATEGORY,
        '존재하지 않는 음식 카테고리 id가 포함되어 있습니다.',
        StatusCodes.BAD_REQUEST,
      );
    }

    const joinUserId = await this.userRepository.addUser({
      ...data,
      preferences: data.preferences,
    });

    for (const preference of data.preferences) {
      await this.userRepository.setPreference(joinUserId, preference);
    }

    const user = await this.userRepository.getUser(joinUserId);
    const preferences =
      await this.userRepository.getUserPreferencesByUserId(joinUserId);

    if (!user) {
      throw new AppError(
        USER_ERROR_CODE.USER_NOT_FOUND,
        '가입 직후 사용자를 조회하지 못했습니다.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      user,
      preferences,
    };
  }
}
