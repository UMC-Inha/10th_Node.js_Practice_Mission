import { IsLatitude, IsLongitude, IsString } from "class-validator";

export class CreateStoreRequest {

  /**
   * 가게 이름
   * @example "BBQ"
   */
  @IsString()
  storeName!: string;

  /**
   * 주소
   * @example "서울특별시 강남구 테헤란로 123"
   */
  @IsString()
  address!: string;

  /**
   * 시/도
   * @example "서울특별시"
   */
  @IsString()
  city!: string;

  /**
   * 구
   * @example "강남구"
   */
  @IsString()
  district!: string;

  /**
   * 동
   * @example "역삼동"
   */
  @IsString()
  neighborhood!: string;

  /**
   * 상세 주소
   * @example "101호"
   */
  @IsString()
  detail!: string;

  /**
   * 위도
   * @example 37.4979
   */
  @IsLatitude()
  latitude!: number;

  /**
   * 경도
   * @example 127.0276
   */
  @IsLongitude()
  longitude!: number;
}