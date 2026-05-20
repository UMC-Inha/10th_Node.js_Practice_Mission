export interface CreateReviewResponse {

  /**
   * 리뷰 ID
   * @example 1
   */
  reviewId: number;

  /**
   * 사용자 ID
   * @example 1
   */
  userId: number;

  /**
   * 가게 ID
   * @example 1
   */
  storeId: number;

  /**
   * 리뷰 평점
   * @example 5
   */
  rating: number;

  /**
   * 리뷰 내용
   * @example "음식이 정말 맛있어요!"
   */
  content: string;

  /**
   * 리뷰 이미지 목록
   */
  images?: string[];

  /**
   * 리뷰 생성일
   */
  createdAt: Date;

  /**
   * 리뷰 삭제일
   */
  deletedAt?: Date;
}