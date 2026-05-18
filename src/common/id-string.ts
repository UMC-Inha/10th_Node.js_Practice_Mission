import { StatusCodes } from 'http-status-codes';
import { AppError } from './app-error';

/** 비음 정수(id) 문자열만 허용 (BigInt 안전, JSON 경계용) */
const UINT_DECIMAL_STRING = /^\d+$/;

/** Express `req.params` 값을 단일 문자열로 정규화 */
export function routeParamToString(
  param: string | string[] | undefined,
): string {
  if (param === undefined) {
    return '';
  }
  if (Array.isArray(param)) {
    return param[0] ?? '';
  }
  return param;
}

export function assertUintString(
  value: string,
  errorCode: string,
  message: string,
): string {
  if (!UINT_DECIMAL_STRING.test(value)) {
    throw new AppError(errorCode, message, StatusCodes.BAD_REQUEST);
  }
  return value;
}

export function bigintToIdString(value: bigint): string {
  return value.toString();
}

/** 라우트 파라미터를 양의 정수 bigint로 파싱 (10진 문자열, 0 불가) */
export function routeParamToPositiveBigInt(
  param: string | string[] | undefined,
  errorCode: string,
  baseMessage: string,
): bigint {
  const s = routeParamToString(param);
  if (!UINT_DECIMAL_STRING.test(s)) {
    throw new AppError(
      errorCode,
      `${baseMessage} (id: ${s || '∅'})`,
      StatusCodes.BAD_REQUEST,
    );
  }
  const id = BigInt(s);
  if (id <= 0n) {
    throw new AppError(
      errorCode,
      `${baseMessage} (id: ${s})`,
      StatusCodes.BAD_REQUEST,
    );
  }
  return id;
}
