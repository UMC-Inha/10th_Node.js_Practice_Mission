import { IsArray, IsNumber, IsOptional, IsString, IsUrl , Matches,Max, Min } from "class-validator";

export class CreateReviewRequest {

  /**
   * 사용자 ID
   * @example 1
   */
  @IsNumber()
  userId!: number;

  /**
   * 가게 ID
   * @example 1
   */
  @IsNumber()
  storeId!: number;

  /**
   * 사용자 미션 ID
   * @example 1
   */
  @IsNumber()
  userMissionId!: number;

  /**
   * 리뷰 평점
   * @example 5
   */
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  /**
   * 리뷰 내용
   * @example "음식이 정말 맛있어요!"
   */
  @IsString()
  content!: string;

  /**
   * 리뷰 이미지 URL 목록
   * @example ["https://example.com/1.jpg"]
   */
    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    @Matches(/\.(jpg|jpeg|png|svg)$/i, {
    each: true,
    message: "jpg, jpeg, png, svg 형식만 가능합니다.",
  })
  imageUrls?: string[];
}