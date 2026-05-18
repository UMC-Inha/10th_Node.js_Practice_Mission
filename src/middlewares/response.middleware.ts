import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonStringifyApi, successResponse } from '../common/api-response';

export const responseEnhancer = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.success = function <T>(data: T, statusCode: number = StatusCodes.OK) {
    return this.status(statusCode)
      .type('application/json')
      .send(jsonStringifyApi(successResponse(data)));
  };

  next();
};
