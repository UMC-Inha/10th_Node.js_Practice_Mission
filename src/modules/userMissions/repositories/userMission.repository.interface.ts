export interface CreateUserMissionParams {
  userId: number;
  missionId: number;
}

export abstract class UserMissionRepositoryInterface {
  abstract existsInProgress(
    userId: number,
    missionId: number,
  ): Promise<boolean>;

  abstract createUserMission(
    params: CreateUserMissionParams,
  ): Promise<number>;

  /** 해당 가게 미션에 연결된 사용자 미션인지(삭제·진행 포함) 검사 */
  abstract userMissionBelongsToStore(
    userId: number,
    userMissionId: number,
    storeId: number,
  ): Promise<boolean>;
}
