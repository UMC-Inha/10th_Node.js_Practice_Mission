import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { AppError } from '../common/app-error';
import { errorResponse } from '../common/api-response';

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(
    new AppError(
      'ROUTE_NOT_FOUND',
      `요청하신 경로를 찾을 수 없습니다: ${req.method} ${req.originalUrl}`,
      StatusCodes.NOT_FOUND,
    ),
  );
};

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json(
        errorResponse(err.errorCode, err.message, err.statusCode, err.details),
      );
    return;
  }

  // 예측하지 못한 에러는 서버 로그에 남기고 500으로 통일
  console.error('[UnhandledError]', err);

  const message =
    process.env.NODE_ENV === 'production'
      ? ReasonPhrases.INTERNAL_SERVER_ERROR
      : err instanceof Error
        ? err.message
        : String(err);

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(
      errorResponse(
        'INTERNAL_SERVER_ERROR',
        message,
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
};
