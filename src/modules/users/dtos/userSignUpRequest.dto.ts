import {
  IsArray,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayMinSize,
  IsDefined,
  IsEnum,
  ArrayUnique,
} from 'class-validator';
import { Type } from 'class-transformer';
import { user_gender } from '../../../generated/prisma/enums.js';

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
  gender!: (typeof user_gender)[keyof typeof user_gender];

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

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsInt({ each: true })
  @IsDefined()
  preferences!: number[];
}
