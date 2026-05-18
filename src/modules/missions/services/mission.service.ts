import { inject, singleton } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import { MissionRepository } from '../repositories/mission.repository';
import { MissionRepositoryInterface } from '../repositories/mission.repository.interface';
import {
  CreateMissionRequest,
  CreateMissionResponse,
} from '../dtos/mission.dto';
import { StoreService } from '../../stores/services/store.service';
import { AppError } from '../../../common/app-error';
import { MISSION_ERROR_CODE } from '../../../common/error-code';

@singleton()
export class MissionService {
  constructor(
    @inject(MissionRepository)
    private readonly missionRepository: MissionRepositoryInterface,
    @inject(StoreService)
    private readonly storeService: StoreService,
  ) {}

  public async createMission(
    storeId: bigint,
    data: CreateMissionRequest,
  ): Promise<CreateMissionResponse> {
    await this.storeService.ensureStoreExists(storeId);

    const endMs = data.endAt.getTime();
    if (Number.isNaN(endMs) || endMs <= Date.now()) {
      throw new AppError(
        MISSION_ERROR_CODE.MISSION_INVALID_END_AT,
        '미션 종료일(endAt)은 현재 시각보다 이후여야 합니다.',
        StatusCodes.BAD_REQUEST,
      );
    }

    const missionId = await this.missionRepository.createMission({
      storeId,
      price: data.price,
      point: data.point,
      endAt: data.endAt,
    });

    return {
      missionId,
      storeId,
      price: data.price,
      point: data.point,
      endAt: data.endAt,
      createdAt: new Date(),
    };
  }

  public async ensureMissionExists(missionId: bigint): Promise<void> {
    const exists = await this.missionRepository.existsById(missionId);

    if (!exists) {
      throw new AppError(
        MISSION_ERROR_CODE.MISSION_NOT_FOUND,
        `존재하지 않는 미션입니다. (id: ${missionId})`,
        StatusCodes.NOT_FOUND,
      );
    }
  }
}
