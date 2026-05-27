import { Body, Controller, Post, Route, Tags, SuccessResponse, Response, Get, Security, Request } from "tsoa";

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
  @Security("jwt")
  @SuccessResponse(
    201,
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
    @Request() req: any,
    @Body() body: CreateReviewRequest,
  ): Promise<ApiResponse<CreateReviewResponse>> {

    const userId = req.user.userId;

    const result = await createReviewService({
      ...body,
      userId,
    });

    this.setStatus(201);

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
  @Security("jwt")
  @SuccessResponse(
    200,
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
  @Get("me")
  public async getMyReviews(
    @Request() req: any,
  ): Promise<ApiResponse<CreateReviewResponse[]>> {

    const userId = req.user.userId;

    const result = await getMyReviewsService(userId);

    this.setStatus(200);

    return ApiResponse.success(
      200,
      "내 리뷰 조회 성공",
      result,
    );
  }
}