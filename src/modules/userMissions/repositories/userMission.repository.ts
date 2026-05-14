import { singleton } from 'tsyringe';
import { prisma } from '../../../config/db.config';
import {
  CreateUserMissionParams,
  UserMissionRepositoryInterface,
} from './userMission.repository.interface';

@singleton()
export class UserMissionRepository implements UserMissionRepositoryInterface {
  public async existsInProgress(
    userId: number,
    missionId: number,
  ): Promise<boolean> {
    const row = await prisma.user_mission.findFirst({
      where: {
        user_id: BigInt(userId),
        mission_id: BigInt(missionId),
        status: 'PROGRESS',
        deleted_at: null,
      },
      select: { id: true },
    });
    return row !== null;
  }

  public async createUserMission(
    params: CreateUserMissionParams,
  ): Promise<number> {
    const row = await prisma.user_mission.create({
      data: {
        created_at: new Date(),
        status: 'PROGRESS',
        mission_id: BigInt(params.missionId),
        user_id: BigInt(params.userId),
      },
    });
    return Number(row.id);
  }

  public async userMissionBelongsToStore(
    userId: number,
    userMissionId: number,
    storeId: number,
  ): Promise<boolean> {
    const row = await prisma.user_mission.findFirst({
      where: {
        id: BigInt(userMissionId),
        user_id: BigInt(userId),
        deleted_at: null,
        mission: {
          store_id: BigInt(storeId),
          deleted_at: null,
        },
      },
      select: { id: true },
    });
    return row !== null;
  }
}
