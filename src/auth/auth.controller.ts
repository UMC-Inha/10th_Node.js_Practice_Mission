import { Body, Controller, Post, Route, SuccessResponse, Tags, Response } from "tsoa";
import { UserSignUpRequest } from "../modules/users/dtos/user.request.dto.js";
import { ApiResponse } from "../common/responses/api.response.js";
import { userSignUp } from "../modules/users/services/user.service.js";
import passport from "passport";
import jwt from "jsonwebtoken";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {

  /**
   * 회원가입 API
   */
  @SuccessResponse(201, "회원가입 성공")
  @Response<ApiResponse<null>>(400, "잘못된 요청")
  @Response<ApiResponse<null>>(409, "이미 존재하는 이메일")
  @Post("signup")
  public async signup(
    @Body() body: UserSignUpRequest,
  ): Promise<ApiResponse<any>> {

    const result = await userSignUp(body);

    this.setStatus(201);

    return ApiResponse.success(
      201,
      "회원가입 성공",
      result,
    );
  }

  /**
   * 이메일 + 비밀번호 로그인
   */
  @Post("login")
  public async login(
    @Body() body: { email: string; password: string },
  ): Promise<any> {

    return new Promise((resolve, reject) => {
      passport.authenticate("local", (err: any, user: any) => {

        if (err || !user) {
          return reject(new Error("로그인 실패"));
        }

        const token = jwt.sign(
          { userId: user.userId },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" },
        );

        resolve(
          ApiResponse.success(
            200,
            "로그인 성공",
            {
              token,
              user,
            },
          ),
        );

      })({ body } as any);
    });
  }
}