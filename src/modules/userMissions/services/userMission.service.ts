import { inject, singleton } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import { UserMissionRepository } from '../repositories/userMission.repository';
import { UserMissionRepositoryInterface } from '../repositories/userMission.repository.interface';
import { ChallengeMissionResponse } from '../dtos/userMission.dto';
import { MissionService } from '../../missions/services/mission.service';
import { AppError } from '../../../common/app-error';
import { MISSION_ERROR_CODE } from '../../../common/error-code';

@singleton()
export class UserMissionService {
  constructor(
    @inject(UserMissionRepository)
    private readonly userMissionRepository: UserMissionRepositoryInterface,
    @inject(MissionService)
    private readonly missionService: MissionService,
  ) {}

  public async challengeMission(
    userId: bigint,
    missionId: bigint,
  ): Promise<ChallengeMissionResponse> {
    // 미션이 존재하는지 검증
    await this.missionService.ensureMissionExists(missionId);

    // 이미 도전 중인 미션인지 검증
    const alreadyInProgress =
      await this.userMissionRepository.existsInProgress(userId, missionId);

    if (alreadyInProgress) {
      throw new AppError(
        MISSION_ERROR_CODE.MISSION_ALREADY_IN_PROGRESS,
        `이미 도전 중인 미션입니다. (userId: ${userId}, missionId: ${missionId})`,
        StatusCodes.CONFLICT,
      );
    }

    const userMissionId = await this.userMissionRepository.createUserMission({
      userId,
      missionId,
    });

    return {
      userMissionId,
      userId,
      missionId,
      status: 'PROGRESS',
      createdAt: new Date(),
    };
  }
}
