import { FoodType } from "../../../generated/prisma/client.js";

export interface UserSignUpResponse {

  /**
   * 사용자 ID
   * @example 1
   */
  userId: number;

  /**
   * 사용자 권한
   * @example "USER"
   */
  role: string;

  /**
   * 사용자 이름
   * @example "홍길동"
   */
  name: string;

  /**
   * 성별
   * @example "male"
   */
  gender: string;

  /**
   * 생년월일
   */
  birth: Date;

  /**
   * 주소
   */
  address: string;

  /**
   * 시/도
   */
  city: string;

  /**
   * 구
   */
  district: string;

  /**
   * 동
   */
  neighborhood: string;

  /**
   * 상세 주소
   */
  detail: string;

  /**
   * 전화번호
   * @example "01012345678"
   */
  phoneNumber: string;

  /**
   * 사용자 포인트
   * @example 0
   */
  point: number;

  /**
   * 생성일
   */
  createdAt: Date;

  /**
   * 선호 음식 카테고리
   * @example ["한식", "일식"]
   */
  preferences: FoodType[];
}