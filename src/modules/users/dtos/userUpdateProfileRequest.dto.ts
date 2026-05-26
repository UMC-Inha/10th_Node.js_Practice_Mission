import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { user_gender } from '../../../generated/prisma/enums.js';
import {
  IsPositiveBigInt,
  positiveBigIntTransform,
} from '../../../common/id-bigint';

export class UserUpdateProfileRequest {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  name?: string;

  @IsOptional()
  @IsEnum(user_gender)
  gender?: user_gender;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birth?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  detailAddress?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(11)
  phoneNumber?: string;

  @ValidateIf((_, value) => value !== undefined)
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v: unknown) => positiveBigIntTransform(v))
      : value,
  )
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsPositiveBigInt({ each: true })
  preferences?: bigint[];
}

export type UserUpdateProfileData = Pick<
  UserUpdateProfileRequest,
  | 'name'
  | 'gender'
  | 'birth'
  | 'address'
  | 'detailAddress'
  | 'phoneNumber'
  | 'preferences'
>;
