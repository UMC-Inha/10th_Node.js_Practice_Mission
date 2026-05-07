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
  //   @IsNumber()
  //   id!: number;

  @IsNumber()
  @IsDefined()
  userId!: number;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name!: string;

  @IsOptional()
  @IsString()
  openAt?: string | null;

  @IsOptional()
  @IsString()
  closedAt?: string | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date | null;

  // 특정 지역에 가게 추가하기
  @IsNumber()
  @IsDefined()
  locationId!: number;
}
