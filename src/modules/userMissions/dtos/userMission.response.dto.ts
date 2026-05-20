export interface ChallengeMissionResponse {

  /**
   * 사용자 미션 ID
   * @example 1
   */
  userMissionId: number;

  /**
   * 사용자 ID
   * @example 1
   */
  userId: number;

  /**
   * 미션 ID
   * @example 1
   */
  missionId: number;

  /**
   * 미션 상태
   * @example "RECEIVED"
   */
  status: string;

  /**
   * 미션 수락 시간
   */
  receivedAt: Date;

  /**
   * 미션 완료 시간
   */
  completedAt: Date | null;
}