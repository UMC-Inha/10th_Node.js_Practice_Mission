import { singleton } from 'tsyringe';
import { prisma } from '../../../config/db.config';
import {
  CreateMissionParams,
  MissionRepositoryInterface,
} from './mission.repository.interface';

@singleton()
export class MissionRepository implements MissionRepositoryInterface {
  public async createMission(params: CreateMissionParams): Promise<number> {
    const row = await prisma.mission.create({
      data: {
        price: params.price,
        point: params.point,
        end_at: params.endAt,
        created_at: new Date(),
        store_id: BigInt(params.storeId),
      },
    });
    return Number(row.id);
  }

  public async existsById(missionId: number): Promise<boolean> {
    const row = await prisma.mission.findFirst({
      where: { id: BigInt(missionId), deleted_at: null },
      select: { id: true },
    });
    return row !== null;
  }
}
