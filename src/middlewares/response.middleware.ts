import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { successResponse } from '../common/api-response';

export const responseEnhancer = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.success = function <T>(data: T, statusCode: number = StatusCodes.OK) {
    return this.status(statusCode).json(successResponse(data));
  };

  next();
};
