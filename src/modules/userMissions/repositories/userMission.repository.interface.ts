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
}
