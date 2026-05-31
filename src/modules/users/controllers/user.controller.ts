import type { Request as ExpressRequest } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  Controller,
  Middlewares,
  Post,
  Request,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { validationMiddleware } from '../../../middlewares/validate.middleware';
import { UserSignUpRequest } from '../dtos/userSignUpRequest.dto';
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
}
