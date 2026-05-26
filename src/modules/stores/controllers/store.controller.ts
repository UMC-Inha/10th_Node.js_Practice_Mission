import { Body, Controller, Post, Route, Tags, SuccessResponse, Response } from "tsoa";
import { StatusCodes } from "http-status-codes";

import { createStoreService } from "../services/store.service.js";

import { ApiResponse } from "../../../common/responses/api.response.js";
import { CreateStoreRequest } from "../dtos/store.request.dto.js";
import { CreateStoreResponse } from "../dtos/store.response.dto.js";

@Route("stores")
@Tags("Stores")
export class StoreController extends Controller {

  /**
   * 가게 생성 API
   *
   * 새로운 가게 정보를 등록합니다.
   */
  @SuccessResponse(
    StatusCodes.CREATED,
    "가게 생성 성공",
  )
  @Response<ApiResponse<null>>(
    400,
    "잘못된 요청",
  )
  @Response<ApiResponse<null>>(
    409,
    "이미 존재하는 가게",
  )
  @Response<ApiResponse<null>>(
    500,
    "서버 내부 오류",
  )
  @Post()
  public async createStore(
    @Body() body: CreateStoreRequest,
  ): Promise<ApiResponse<CreateStoreResponse>> {

    const result = await createStoreService(body);

    this.setStatus(StatusCodes.CREATED);

    return ApiResponse.success(
      201,
      "가게 생성 성공",
      result,
    );
  }
}