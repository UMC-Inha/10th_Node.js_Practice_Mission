import { singleton } from 'tsyringe';
import { prisma } from '../../../config/db.config';
import {
  CreateMissionParams,
  MissionRepositoryInterface,
} from './mission.repository.interface';

@singleton()
export class MissionRepository implements MissionRepositoryInterface {
  public async createMission(params: CreateMissionParams): Promise<bigint> {
    const row = await prisma.mission.create({
      data: {
        price: params.price,
        point: params.point,
        end_at: params.endAt,
        created_at: new Date(),
        store_id: params.storeId,
      },
    });
    return row.id;
  }

  public async existsById(missionId: bigint): Promise<boolean> {
    const row = await prisma.mission.findFirst({
      where: { id: missionId, deleted_at: null },
      select: { id: true },
    });
    return row !== null;
  }
}
