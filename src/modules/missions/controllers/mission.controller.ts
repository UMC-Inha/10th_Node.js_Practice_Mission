import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { MissionService } from '../services/mission.service';
import { STORE_ERROR_CODE } from '../../../common/error-code';
import { routeParamToPositiveBigInt } from '../../../common/id-string';

@injectable()
export class MissionController {
  constructor(
    @inject(MissionService) private readonly missionService: MissionService
  ) {}

  public handleCreateMissionForStore = async (req: Request, res: Response) => {
    const storeId = routeParamToPositiveBigInt(
      req.params.storeId,
      STORE_ERROR_CODE.STORE_NOT_FOUND,
      '유효하지 않은 가게 id 입니다.',
    );

    const mission = await this.missionService.createMission(storeId, req.body);
    res.success(mission, StatusCodes.CREATED);
  };
}
