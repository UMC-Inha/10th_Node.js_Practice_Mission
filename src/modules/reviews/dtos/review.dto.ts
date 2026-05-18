import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  IsPositiveBigInt,
  positiveBigIntTransform,
} from '../../../common/id-bigint';

export class CreateReviewRequest {
  @Transform(({ value }) => positiveBigIntTransform(value))
  @IsDefined()
  @IsPositiveBigInt()
  userId!: bigint;

  @Transform(({ value }) => positiveBigIntTransform(value))
  @IsDefined()
  @IsPositiveBigInt()
  userMissionId!: bigint;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  content!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  score?: number;
}

export interface CreateReviewResponse {
  reviewId: bigint;
  storeId: bigint;
  userId: bigint;
  userMissionId: bigint;
  content: string;
  score: number | null;
  createdAt: Date;
}
