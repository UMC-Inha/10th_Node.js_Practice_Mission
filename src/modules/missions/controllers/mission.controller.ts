import { Body, Controller, Path, Post, Route, Tags, SuccessResponse, Response, Get, Security } from "tsoa";

import { 
  createMissionService,
  getStoreMissionsService 
} from "../services/mission.service.js";

import { ApiResponse } from "../../../common/responses/api.response.js";
import { CreateMissionRequest } from "../dtos/misison.request.dto.js";
import { CreateMissionResponse } from "../dtos/mission.response.dto.js";

@Route("missions")
@Tags("Missions")
export class MissionController extends Controller {

  /**
   * 미션 생성 API
   *
   * 특정 가게에 새로운 미션을 생성합니다.
   */
  @Security("jwt")
  @SuccessResponse(
    201,
    "미션 생성 성공",
  )
  @Response<ApiResponse<null>>(
    400,
    "잘못된 요청",
  )
  @Response<ApiResponse<null>>(
    404,
    "가게를 찾을 수 없음",
  )
  @Response<ApiResponse<null>>(
    500,
    "서버 내부 오류",
  )
  @Post("{storeId}")
  public async createMission(
    /**
     * 미션을 생성할 가게 ID
     * @example 1
     */
    @Path() storeId: number,

    @Body() body: CreateMissionRequest,
  ): Promise<ApiResponse<CreateMissionResponse>> {

    const result = await createMissionService(
      storeId,
      body,
    );

    this.setStatus(201);

    return ApiResponse.success(
      201,
      "미션 생성 성공",
      result,
    );
  }

  /**
   * 가게 미션 목록 조회 API
   *
   * 특정 가게의 미션 목록을 조회합니다.
   */
  @SuccessResponse(
    200,
    "가게 미션 조회 성공",
  )
  @Response<ApiResponse<null>>(
    404,
    "가게를 찾을 수 없음",
  )
  @Response<ApiResponse<null>>(
    500,
    "서버 내부 오류",
  )
  @Get("{storeId}")
  public async getStoreMissions(

    /**
     * 조회할 가게 ID
     * @example 1
     */
    @Path() storeId: number,

  ): Promise<ApiResponse<CreateMissionResponse[]>> {

    const result = await getStoreMissionsService(storeId);

    this.setStatus(200);

    return ApiResponse.success(
      200,
      "가게 미션 조회 성공",
      result,
    );
  }
}