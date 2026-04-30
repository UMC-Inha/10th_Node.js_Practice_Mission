import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
  public readonly errorCode: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    errorCode: string,
    message: string,
    statusCode: number = StatusCodes.BAD_REQUEST,
    details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}
