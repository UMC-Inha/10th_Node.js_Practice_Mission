import { UserSignUpRequest } from '../dtos/userSignUpRequest.dto';
import { UserSignUpResponse } from '../dtos/UserSignUpResponse.dto';

export abstract class UserRepositoryInterface {
  abstract addUser(data: UserSignUpRequest): Promise<number>;
  abstract getUser(userId: number): Promise<UserSignUpResponse>;
  abstract setPreference(userId: number, foodCategoryId: number): Promise<void>;
  abstract getUserPreferencesByUserId(userId: number): Promise<any[]>;
}
