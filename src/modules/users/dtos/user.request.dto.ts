import { ArrayNotEmpty, IsArray, IsDateString, IsEmail, IsOptional, IsString } from "class-validator";

export class UserSignUpRequest {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  name!: string;

  @IsString()
  gender!: string;

  @IsDateString()
  birth!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsString()
  phoneNumber!: string;

  @IsArray()
  @ArrayNotEmpty()
  preferences!: number[];
}