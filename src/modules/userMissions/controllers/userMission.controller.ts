import type { Request as ExpressRequest } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  Controller,
  Path,
  Post,
  Request,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../common/app-error';
import {
  MISSION_ERROR_CODE,
  USER_ERROR_CODE,
} from '../../../common/error-code';
import { routeParamToPositiveBigInt } from '../../../common/id-string';
import { UserMissionService } from '../services/userMission.service';

@Route('missions')
@Tags('UserMissions')
@injectable()
export class UserMissionController extends Controller {
  constructor(
    @inject(UserMissionService)
    private readonly userMissionService: UserMissionService,
  ) {
    super();
  }

  /**
   * 미션 도전하기 (도전 중인 미션에 추가)
   */
  @Post('{missionId}/challenges')
  @SuccessResponse(StatusCodes.CREATED, 'Created')
  public async challengeMission(
    @Path() missionId: string,
    @Request() req: ExpressRequest,
  ): Promise<Record<string, unknown>> {
    if (!req.user) {
      throw new AppError(
        USER_ERROR_CODE.USER_NOT_AUTHENTICATED,
        '인증이 필요합니다.',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const parsedMissionId = routeParamToPositiveBigInt(
      missionId,
      MISSION_ERROR_CODE.MISSION_NOT_FOUND,
      '유효하지 않은 미션 id 입니다.',
    );

    const userMission = await this.userMissionService.challengeMission(
      req.user.id,
      parsedMissionId,
    );
    this.setStatus(StatusCodes.CREATED);
    return userMission as unknown as Record<string, unknown>;
  }
}
