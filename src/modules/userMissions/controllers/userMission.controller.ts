import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { UserMissionService } from '../services/userMission.service';
import { AppError } from '../../../common/app-error';
import {
  MISSION_ERROR_CODE,
  USER_ERROR_CODE,
} from '../../../common/error-code';

@injectable()
export class UserMissionController {
  constructor(
    @inject(UserMissionService)
    private readonly userMissionService: UserMissionService,
  ) {}

  public handleChallengeMission = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(
        USER_ERROR_CODE.USER_NOT_AUTHENTICATED,
        '인증이 필요합니다.',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const missionId = Number(req.params.missionId);

    if (!Number.isInteger(missionId) || missionId <= 0) {
      throw new AppError(
        MISSION_ERROR_CODE.MISSION_NOT_FOUND,
        `유효하지 않은 미션 id 입니다. (id: ${req.params.missionId})`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const userMission = await this.userMissionService.challengeMission(
      req.user.id,
      missionId,
    );
    res.success(userMission, StatusCodes.CREATED);
  };
}
