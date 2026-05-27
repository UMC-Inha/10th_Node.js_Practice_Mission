import { Body, Controller, Post, Route, Tags, SuccessResponse, Response, Put, Path } from "tsoa";
import { StatusCodes } from "http-status-codes";

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
    StatusCodes.CREATED, 
    "회원가입 성공",
  )
  @Response<ApiResponse<null>>(
    400, 
    "잘못된 요청",
  )
  @Response<ApiResponse<null>>(
    409, 
    "이미 존재하는 이메일",
  )
  @Response<ApiResponse<null>>(
    500, 
    "서버 내부 오류",
  )
  @Post("signup")
  
  public async handleUserSignUp(
    @Body() body: UserSignUpRequest,
  ): Promise<ApiResponse<UserSignUpResponse>> {

    const user = await userSignUp(body);

    this.setStatus(StatusCodes.CREATED);

    return ApiResponse.success(
      StatusCodes.CREATED,
      "회원가입 성공",
      user,
    );
  }

  /**
   * 내 정보 수정 API
   */
  @SuccessResponse(StatusCodes.OK, "회원 정보 수정 성공")
  @Response<ApiResponse<null>>(400, "잘못된 요청")
  @Response<ApiResponse<null>>(404, "유저 없음")
  @Response<ApiResponse<null>>(500, "서버 내부 오류")
  @Put("{userId}")
  public async handleUpdateMyInfo(
    @Path() userId: number,
    @Body() body: UpdateMyInfoRequest,
  ): Promise<ApiResponse<UserSignUpResponse>> {

    const user = await updateMyInfo(userId, body);

    this.setStatus(StatusCodes.OK);

    return ApiResponse.success(
      StatusCodes.OK,
      "회원 정보 수정 성공",
      user,
    );
  }
}