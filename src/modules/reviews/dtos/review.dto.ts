import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReviewRequest {
  @IsInt()
  userId!: number;

  @IsInt()
  userMissionId!: number;

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
  reviewId: number;
  storeId: number;
  userId: number;
  userMissionId: number;
  content: string;
  score: number | null;
  createdAt: Date;
}
