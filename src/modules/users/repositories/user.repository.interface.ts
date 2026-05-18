import { UserSignUpRequest } from '../dtos/userSignUpRequest.dto';

export type UserProfile = {
  id: bigint;
  email: string;
  name: string;
  gender: string;
  birth: Date | null;
  address: string;
  detailAddress: string;
  phoneNumber: string;
};

export type UserPreferenceRow = {
  food_category_id: bigint;
  user_id: bigint;
  name: string | null;
};

export abstract class UserRepositoryInterface {
  abstract addUser(data: UserSignUpRequest): Promise<bigint>;
  abstract getUser(userId: bigint): Promise<UserProfile | null>;
  abstract setPreference(
    userId: bigint,
    foodCategoryId: bigint,
  ): Promise<void>;
  abstract getUserPreferencesByUserId(
    userId: bigint,
  ): Promise<UserPreferenceRow[]>;
}
