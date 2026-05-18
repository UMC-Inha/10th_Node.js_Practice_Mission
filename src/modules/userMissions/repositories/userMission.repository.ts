import { singleton } from 'tsyringe';
import { prisma } from '../../../config/db.config';
import {
  CreateUserMissionParams,
  UserMissionRepositoryInterface,
} from './userMission.repository.interface';

@singleton()
export class UserMissionRepository implements UserMissionRepositoryInterface {
  public async existsInProgress(
    userId: bigint,
    missionId: bigint,
  ): Promise<boolean> {
    const row = await prisma.user_mission.findFirst({
      where: {
        user_id: userId,
        mission_id: missionId,
        status: 'PROGRESS',
        deleted_at: null,
      },
      select: { id: true },
    });
    return row !== null;
  }

  public async createUserMission(
    params: CreateUserMissionParams,
  ): Promise<bigint> {
    const row = await prisma.user_mission.create({
      data: {
        created_at: new Date(),
        status: 'PROGRESS',
        mission_id: params.missionId,
        user_id: params.userId,
      },
    });
    return row.id;
  }

  public async userMissionBelongsToStore(
    userId: bigint,
    userMissionId: bigint,
    storeId: bigint,
  ): Promise<boolean> {
    const row = await prisma.user_mission.findFirst({
      where: {
        id: userMissionId,
        user_id: userId,
        deleted_at: null,
        mission: {
          store_id: storeId,
          deleted_at: null,
        },
      },
      select: { id: true },
    });
    return row !== null;
  }
}
