export interface CreateMissionParams {
  storeId: number;
  price: number;
  point: number;
  endAt: Date;
}

export abstract class MissionRepositoryInterface {
  abstract createMission(params: CreateMissionParams): Promise<number>;
  abstract existsById(missionId: number): Promise<boolean>;
}
