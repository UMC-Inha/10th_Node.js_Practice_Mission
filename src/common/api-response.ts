import { StatusCodes } from 'http-status-codes';

export interface ApiErrorBody {
  errorCode: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  error: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export const successResponse = <T>(data: T): ApiSuccessResponse<T> => ({
  success: true,
  data,
  error: null,
});

export const errorResponse = (
  errorCode: string,
  message: string,
  statusCode: number = StatusCodes.BAD_REQUEST,
  details?: unknown,
): ApiErrorResponse => ({
  success: false,
  data: null,
  error: {
    errorCode,
    message,
    statusCode,
    ...(details !== undefined && { details }),
  },
});
