import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayMinSize,
  IsDefined,
  IsEnum,
  ArrayUnique,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { user_gender } from '../../../generated/prisma/enums.js';
import {
  IsPositiveBigInt,
  positiveBigIntTransform,
} from '../../../common/id-bigint';

export class UserSignUpRequest {
  @IsEmail()
  @IsDefined()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name!: string;

  @IsEnum(user_gender)
  @IsDefined()
  gender!: user_gender;

  @IsDate()
  @Type(() => Date)
  @IsDefined()
  birth!: Date;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  detailAddress?: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  phoneNumber!: string;

  /** 로컬 가입 시 생략하면 `local:{email}`로 저장됩니다. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  socialId?: string;

  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v: unknown) => positiveBigIntTransform(v))
      : value,
  )
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsPositiveBigInt({ each: true })
  @IsDefined()
  preferences!: bigint[];
}
