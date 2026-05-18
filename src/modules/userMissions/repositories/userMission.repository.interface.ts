export interface CreateUserMissionParams {
  userId: bigint;
  missionId: bigint;
}

export abstract class UserMissionRepositoryInterface {
  abstract existsInProgress(
    userId: bigint,
    missionId: bigint,
  ): Promise<boolean>;

  abstract createUserMission(
    params: CreateUserMissionParams,
  ): Promise<bigint>;

  /** 해당 가게 미션에 연결된 사용자 미션인지(삭제·진행 포함) 검사 */
  abstract userMissionBelongsToStore(
    userId: bigint,
    userMissionId: bigint,
    storeId: bigint,
  ): Promise<boolean>;
}
