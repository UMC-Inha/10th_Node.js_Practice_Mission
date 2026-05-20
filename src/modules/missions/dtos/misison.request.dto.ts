import { IsNumber, IsString, Min } from "class-validator";

export class CreateMissionRequest {

  /**
   * 가게 ID
   * @example 1
   */
  @IsNumber()
  storeId!: number;

  /**
   * 미션 제목
   * @example "가게이름a에서 12,000원 이상의 식사를 하세요!"
   */
  @IsString()
  title!: string;

  /**
   * 미션 설명
   * @example "방문 후 리뷰 작성하기"
   */
  @IsString()
  description!: string;

  /**
   * 보상 포인트
   * @example 500
   */
  @IsNumber()
  @Min(0)
  reward!: number;
}