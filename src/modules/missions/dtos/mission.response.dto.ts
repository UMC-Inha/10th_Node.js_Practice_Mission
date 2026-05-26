export interface CreateMissionResponse {

  /**
   * 미션 ID
   * @example 1
   */
  missionId: number;

  /**
   * 가게 ID
   * @example 1
   */
  storeId: number;

  /**
   * 미션 제목
   * @example "혼밥 챌린지"
   */
  title: string;

  /**
   * 미션 설명
   * @example "혼자 방문 후 리뷰 작성하기"
   */
  description: string;

  /**
   * 보상 포인트
   * @example 500
   */
  reward: number;

  /**
   * 생성일
   */
  createdAt: Date;
}