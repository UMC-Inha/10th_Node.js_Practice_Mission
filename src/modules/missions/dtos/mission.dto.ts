import { IsDate, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMissionRequest {
  @IsInt()
  @Min(0)
  price!: number;

  @IsInt()
  @Min(0)
  point!: number;

  @IsDate()
  @Type(() => Date)
  endAt!: Date;
}

export interface CreateMissionResponse {
  missionId: number;
  storeId: number;
  price: number;
  point: number;
  endAt: Date;
  createdAt: Date;
}
