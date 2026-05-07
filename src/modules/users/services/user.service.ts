import { inject, singleton } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import { UserSignUpRequest } from '../dtos/userSignUpRequest.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { AppError } from '../../../common/app-error';
import { USER_ERROR_CODE } from '../../../common/error-code';

@singleton()
export class UserService {
  constructor(
    @inject(UserRepository)
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async userSignUp(data: UserSignUpRequest) {
    const joinUserId = await this.userRepository.addUser({
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
      preferences: data.preferences,
    });

    if (joinUserId === null) {
      throw new AppError(
        USER_ERROR_CODE.EMAIL_ALREADY_EXISTS,
        '이미 존재하는 이메일입니다.',
        StatusCodes.CONFLICT,
      );
    }

    for (const preference of data.preferences) {
      await this.userRepository.setPreference(joinUserId, preference);
    }

    const user = await this.userRepository.getUser(joinUserId);
    const preferences =
      await this.userRepository.getUserPreferencesByUserId(joinUserId);

    return { user, preferences };
  }
}
