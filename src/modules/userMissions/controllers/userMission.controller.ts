import { Controller, Path, Post, Route, Tags, SuccessResponse, Response, Get, Patch, Security, Request } from "tsoa";

import { 
  challengeMissionService,
  getReceivedMissionsService,
  completeUserMissionService
} from "../services/userMission.service.js";

import { ApiResponse } from "../../../common/responses/api.response.js";
import { ChallengeMissionResponse } from "../dtos/userMission.response.dto.js";

@Route("user-missions")
@Tags("UserMissions")
export class UserMissionController extends Controller {

  /**
   * 미션 도전 API
   *
   * 사용자가 특정 미션에 도전합니다.
   */
  @Security("jwt")
  @SuccessResponse(201, "미션 도전 성공")
  @Response<ApiResponse<null>>(400, "잘못된 요청")
  @Response<ApiResponse<null>>(404, "유저 또는 미션 없음")
  @Response<ApiResponse<null>>(409, "이미 도전한 미션")
  @Response<ApiResponse<null>>(500, "서버 내부 오류")
  @Post("{missionId}")
  public async challengeMission(
    @Request() req: any,

    /**
     * 미션 ID
     * @example 1
     */
    @Path() missionId: number,
  ): Promise<ApiResponse<ChallengeMissionResponse>> {

    const userId = req.user.userId;

    const result = await challengeMissionService(
      missionId,
      userId,
    );

    this.setStatus(201);

    return ApiResponse.success(
      201,
      "미션 도전 성공",
      result,
    );
  }

  /**
   * 진행중 미션 조회 API
   *
   * 사용자가 진행중인 미션 목록을 조회합니다.
   */
  @Security("jwt")
  @SuccessResponse(200, "진행중 미션 조회 성공")
  @Response<ApiResponse<null>>(404, "유저 없음")
  @Response<ApiResponse<null>>(500, "서버 내부 오류")
  @Get("me")
  public async getReceivedMissions(
    @Request() req: any,
  ): Promise<ApiResponse<ChallengeMissionResponse[]>> {

    const userId = req.user.userId;

    const result = await getReceivedMissionsService(userId);

    return ApiResponse.success(
      200,
      "진행중 미션 조회 성공",
      result,
    );
  }

  /**
   * 미션 완료 처리 API
   *
   * 사용자가 진행중인 미션을 완료 처리합니다.
   */
  @Security("jwt")
  @SuccessResponse(200, "미션 완료 처리 성공")
  @Response<ApiResponse<null>>(400, "잘못된 요청")
  @Response<ApiResponse<null>>(404, "유저 미션 없음")
  @Response<ApiResponse<null>>(409, "이미 완료된 미션")
  @Response<ApiResponse<null>>(500, "서버 내부 오류")
  @Patch("{userMissionId}")
  public async completeUserMission(
    @Request() req: any,

    /**
     * 사용자 미션 ID
     * @example 1
     */
    @Path() userMissionId: number,
  ): Promise<ApiResponse<ChallengeMissionResponse>> {

    const userId = req.user.userId;

    const result = await completeUserMissionService(
      userMissionId,
      userId,
    );

    return ApiResponse.success(
      200,
      "미션 완료 처리 성공",
      result,
    );
  }
}