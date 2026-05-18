import {
  IsString,
  IsOptional,
  IsDate,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  IsPositiveBigInt,
  positiveBigIntTransform,
} from '../../../common/id-bigint';

export class CreateStoreRequest {
  @Transform(({ value }) => positiveBigIntTransform(value))
  @IsDefined()
  @IsPositiveBigInt()
  userId!: bigint;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name!: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  openAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  closedAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date | null;

  @Transform(({ value }) => positiveBigIntTransform(value))
  @IsDefined()
  @IsPositiveBigInt()
  locationId!: bigint;
}
