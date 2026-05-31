import type { Request as ExpressRequest } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  Controller,
  Middlewares,
  Patch,
  Post,
  Request,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../common/app-error';
import { USER_ERROR_CODE } from '../../../common/error-code';
import { validationMiddleware } from '../../../middlewares/validate.middleware';
import { UserSignUpRequest } from '../dtos/userSignUpRequest.dto';
import { UserUpdateProfileRequest } from '../dtos/userUpdateProfileRequest.dto';
import { UserService } from '../services/user.service';

@Route('users')
@Tags('Users')
@injectable()
export class UserController extends Controller {
  constructor(@inject(UserService) private readonly userService: UserService) {
    super();
  }

  /**
   * 회원가입
   */
  @Post('signup')
  @SuccessResponse(StatusCodes.CREATED, 'Created')
  @Middlewares(validationMiddleware(UserSignUpRequest))
  public async signUp(@Request() req: ExpressRequest): Promise<Record<string, unknown>> {
    const body = req.body as UserSignUpRequest;
    const user = await this.userService.userSignUp(body);
    this.setStatus(StatusCodes.CREATED);
    return user as unknown as Record<string, unknown>;
  }

  /**
   * 내 프로필 수정 (소셜 로그인 후 추가 정보 입력 등)
   */
  @Patch('me')
  @SuccessResponse(StatusCodes.OK, 'OK')
  @Middlewares(validationMiddleware(UserUpdateProfileRequest))
  public async updateMyProfile(
    @Request() req: ExpressRequest,
  ): Promise<Record<string, unknown>> {
    if (!req.user) {
      throw new AppError(
        USER_ERROR_CODE.USER_NOT_AUTHENTICATED,
        '인증이 필요합니다.',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const body = req.body as UserUpdateProfileRequest;
    const user = await this.userService.updateProfile(req.user.id, body);
    return user as unknown as Record<string, unknown>;
  }
}
