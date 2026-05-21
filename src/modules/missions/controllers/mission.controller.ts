import type { Request as ExpressRequest } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  Controller,
  Middlewares,
  Path,
  Post,
  Request,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { STORE_ERROR_CODE } from '../../../common/error-code';
import { routeParamToPositiveBigInt } from '../../../common/id-string';
import { validationMiddleware } from '../../../middlewares/validate.middleware';
import { CreateMissionRequest } from '../dtos/mission.dto';
import { MissionService } from '../services/mission.service';

@Route('stores')
@Tags('Missions')
@injectable()
export class MissionController extends Controller {
  constructor(
    @inject(MissionService) private readonly missionService: MissionService,
  ) {
    super();
  }

  /**
   * 가게에 미션 추가하기
   */
  @Post('{storeId}/missions')
  @SuccessResponse(StatusCodes.CREATED, 'Created')
  @Middlewares(validationMiddleware(CreateMissionRequest))
  public async createMissionForStore(
    @Path() storeId: string,
    @Request() req: ExpressRequest,
  ): Promise<Record<string, unknown>> {
    const parsedStoreId = routeParamToPositiveBigInt(
      storeId,
      STORE_ERROR_CODE.STORE_NOT_FOUND,
      '유효하지 않은 가게 id 입니다.',
    );

    const body = req.body as CreateMissionRequest;
    const mission = await this.missionService.createMission(parsedStoreId, body);
    this.setStatus(StatusCodes.CREATED);
    return mission as unknown as Record<string, unknown>;
  }
}
