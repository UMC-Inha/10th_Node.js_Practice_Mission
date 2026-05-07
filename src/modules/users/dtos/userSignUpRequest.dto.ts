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
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserSignUpRequest {
  @IsEmail()
  @IsDefined()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  gender!: string;

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

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @IsDefined()
  preferences!: number[];
}
