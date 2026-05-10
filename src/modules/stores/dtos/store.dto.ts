import {
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStoreRequest {
  @IsNumber()
  @IsDefined()
  userId!: number;

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

  @IsNumber()
  @IsDefined()
  locationId!: number;
}
