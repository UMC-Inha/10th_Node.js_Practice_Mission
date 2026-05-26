import { Body, Controller, Path, Post, Route, Tags, SuccessResponse, Response, Get } from "tsoa";
import { StatusCodes } from "http-status-codes";

import { 
  createReviewService, 
  getMyReviewsService 
} from "../services/review.service.js";

import { ApiResponse } from "../../../common/responses/api.response.js";
import { CreateReviewRequest } from "../dtos/review.request.dto.js";
import { CreateReviewResponse } from "../dtos/review.response.dto.js";

@Route("reviews")
@Tags("Reviews")
export class ReviewController extends Controller {

  /**
   * 리뷰 작성 API
   *
   * 사용자가 수행한 미션에 대한 리뷰를 작성합니다.
   */
  @SuccessResponse(
    StatusCodes.CREATED,
    "리뷰 작성 성공",
  )
  @Response<ApiResponse<null>>(
    400,
    "잘못된 요청",
  )
  @Response<ApiResponse<null>>(
    404,
    "유저 또는 미션을 찾을 수 없음",
  )
  @Response<ApiResponse<null>>(
    409,
    "이미 리뷰가 존재함",
  )
  @Response<ApiResponse<null>>(
    500,
    "서버 내부 오류",
  )
  @Post()
  public async createReview(
    @Body() body: CreateReviewRequest,
  ): Promise<ApiResponse<CreateReviewResponse>> {

    const result = await createReviewService(body);

    this.setStatus(StatusCodes.CREATED);

    return ApiResponse.success(
      201,
      "리뷰 작성 성공",
      result,
    );
  }

  /**
   * 내 리뷰 조회 API
   *
   * 특정 사용자가 작성한 리뷰 목록을 조회합니다.
   */
  @SuccessResponse(
    StatusCodes.OK,
    "내 리뷰 조회 성공",
  )
  @Response<ApiResponse<null>>(
    404,
    "유저를 찾을 수 없음",
  )
  @Response<ApiResponse<null>>(
    500,
    "서버 내부 오류",
  )
  @Get("{userId}")
  public async getMyReviews(

    /**
     * 사용자 ID
     * @example 1
     */
    @Path() userId: number,

  ): Promise<ApiResponse<CreateReviewResponse[]>> {

    const result = await getMyReviewsService(userId);

    this.setStatus(StatusCodes.OK);

    return ApiResponse.success(
      200,
      "내 리뷰 조회 성공",
      result,
    );
  }
}