import { ValidationOptions, ValidateBy } from 'class-validator';

function tryPositiveBigInt(value: unknown): bigint | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'bigint') {
    return value > 0n ? value : null;
  }
  if (typeof value === 'number') {
    if (!Number.isInteger(value) || value <= 0) {
      return null;
    }
    return BigInt(value);
  }
  if (typeof value === 'string') {
    if (!/^\d+$/.test(value) || value === '0') {
      return null;
    }
    try {
      return BigInt(value);
    } catch {
      return null;
    }
  }
  return null;
}

/** 본문 JSON 등에서 숫자/문자열을 양의 bigint로 변환 (class-transformer `@Transform`용) */
export function positiveBigIntTransform(value: unknown): bigint {
  return tryPositiveBigInt(value) ?? 0n;
}

export function IsPositiveBigInt(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isPositiveBigInt',
      validator: {
        validate: (v): v is bigint => typeof v === 'bigint' && v > 0n,
        defaultMessage: () => 'id는 양의 정수여야 합니다.',
      },
    },
    validationOptions,
  );
}
