import { Body, Controller, Post, Route, Tags, SuccessResponse, Response, Put, Request, Security } from "tsoa";

import { UpdateMyInfoRequest, UserSignUpRequest } from "../dtos/user.request.dto.js";
import { updateMyInfo, userSignUp } from "../services/user.service.js";

import { ApiResponse } from "../../../common/responses/api.response.js";
import { UserSignUpResponse } from "../dtos/user.response.dto.js";

@Route("users")
@Tags("Users")
export class UserController extends Controller {

  /**
   * 회원가입 API
   *
   * 사용자를 생성하고 선호 카테고리를 저장합니다.
   */
  @SuccessResponse(
    201,
    "회원가입 성공",
  )
  @Response<ApiResponse<null>>(400, "잘못된 요청")
  @Response<ApiResponse<null>>(409, "이미 존재하는 이메일")
  @Response<ApiResponse<null>>(500, "서버 내부 오류")
  @Post("signup")
  public async handleUserSignUp(
    @Body() body: UserSignUpRequest,
  ): Promise<ApiResponse<UserSignUpResponse>> {

    const user = await userSignUp(body);

    this.setStatus(201);

    return ApiResponse.success(
      201,
      "회원가입 성공",
      user,
    );
  }

  /**
   * 내 정보 수정 API
   * 
   * 사용자의 정보를 수정합니다.
   */
  @Security("jwt")
  @SuccessResponse(200, "회원 정보 수정 성공")
  @Response<ApiResponse<null>>(400, "잘못된 요청")
  @Response<ApiResponse<null>>(404, "유저 없음")
  @Response<ApiResponse<null>>(500, "서버 내부 오류")
  @Put("me")
  public async handleUpdateMyInfo(
    @Request() req: any,
    @Body() body: UpdateMyInfoRequest,
  ): Promise<ApiResponse<UserSignUpResponse>> {

    const userId = req.user.userId;

    const user = await updateMyInfo(userId, body);

    return ApiResponse.success(
      200,
      "회원 정보 수정 성공",
      user,
    );
  }
}