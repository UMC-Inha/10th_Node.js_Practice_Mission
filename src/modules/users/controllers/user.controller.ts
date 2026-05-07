import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { UserService } from '../services/user.service';

@injectable()
export class UserController {
  constructor(@inject(UserService) private readonly userService: UserService) {}

  public handleUserSignUp = async (req: Request, res: Response) => {
    const user = await this.userService.userSignUp(req.body);

    res.success(user, StatusCodes.CREATED);
  };
}
