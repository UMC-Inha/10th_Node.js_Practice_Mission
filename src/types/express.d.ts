import 'express';
import { ApiSuccessResponse } from '../common/api-response';

export interface AuthenticatedUser {
  id: bigint;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }

    interface Response {
      success<T>(data: T, statusCode?: number): Response<ApiSuccessResponse<T>>;
    }
  }
}

export {};
