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
   * 사용자 성별
   * @example "male"
   */
  @IsString()
  gender!: string;

  /**
   * 사용자 생년월일
   * @example "2000-01-01"
   */
  @IsDateString()
  birth!: string;

  /**
   * 주소
   * @example "서울특별시 강남구"
   */
  @IsOptional()
  @IsString()
  address?: string;

  /**
   * 시/도
   * @example "서울특별시"
   */
  @IsOptional()
  @IsString()
  city?: string;

  /**
   * 구
   * @example "강남구"
   */
  @IsOptional()
  @IsString()
  district?: string;

  /**
   * 동
   * @example "역삼동"
   */
  @IsOptional()
  @IsString()
  neighborhood?: string;

  /**
   * 상세 주소
   * @example "101동 202호"
   */
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