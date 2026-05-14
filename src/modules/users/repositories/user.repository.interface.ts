import { UserSignUpRequest } from '../dtos/userSignUpRequest.dto';

export type UserProfile = {
  id: number;
  email: string;
  name: string;
  gender: string;
  birth: Date | null;
  address: string;
  detailAddress: string;
  phoneNumber: string;
};

export type UserPreferenceRow = {
  food_category_id: number;
  user_id: number;
  name: string | null;
};

export abstract class UserRepositoryInterface {
  abstract addUser(data: UserSignUpRequest): Promise<number>;
  abstract getUser(userId: number): Promise<UserProfile | null>;
  abstract setPreference(
    userId: number,
    foodCategoryId: number,
  ): Promise<void>;
  abstract getUserPreferencesByUserId(
    userId: number,
  ): Promise<UserPreferenceRow[]>;
}
