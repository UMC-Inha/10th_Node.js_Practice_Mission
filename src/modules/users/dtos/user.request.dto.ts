import { ArrayNotEmpty, IsArray, IsDateString, IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { FoodType } from "../../../generated/prisma/enums.js";

export class UserSignUpRequest {

  /**
   * 사용자 이메일
   * @example "test@example.com"
   */
  @IsEmail()
  email!: string;

  /**
   * 사용자 비밀번호
   * @example "1234"
   */
  @IsString()
  password!: string;

  /**
   * 사용자 이름
   * @example "홍길동"
   */
  @IsString()
  name!: string;

  /**
   * 성별
   * @example "male"
   */
  @IsString()
  gender!: string;

  /**
   * 생년월일
   * @example "2000-01-01"
   */
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

  /**
   * 전화번호
   * @example "01012345678"
   */
  @IsString()
  phoneNumber!: string;

  /**
   * 선호 음식 카테고리 목록
   * @example ["한식", "일식"]
   */
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(FoodType, { each: true })
  preferences!: FoodType[];
}