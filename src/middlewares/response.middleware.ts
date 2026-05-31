import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonStringifyApi, successResponse } from '../common/api-response';

const isApiEnvelope = (body: unknown): body is Record<string, unknown> =>
  body !== null &&
  typeof body === 'object' &&
  'success' in body &&
  'data' in body &&
  'error' in body;

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

  res.json = function (body: unknown) {
    const payload = isApiEnvelope(body) ? body : successResponse(body);
    return this.type('application/json').send(jsonStringifyApi(payload));
  };

  next();
};
