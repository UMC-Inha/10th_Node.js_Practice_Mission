import {
  IsArray,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserSignUpRequest {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  gender!: string;

  @IsDate()
  @Type(() => Date)
  birth!: Date;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  detailAddress?: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  preferences!: number[];
}
