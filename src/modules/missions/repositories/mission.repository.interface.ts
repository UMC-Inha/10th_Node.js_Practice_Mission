export interface CreateMissionParams {
  storeId: bigint;
  price: number;
  point: number;
  endAt: Date;
}

export abstract class MissionRepositoryInterface {
  abstract createMission(params: CreateMissionParams): Promise<bigint>;
  abstract existsById(missionId: bigint): Promise<boolean>;
}
