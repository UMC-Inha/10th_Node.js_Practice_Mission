import { IsDate, IsDefined, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMissionRequest {
  @IsDefined()
  @IsInt()
  @Min(0)
  price!: number;

  @IsDefined()
  @IsInt()
  @Min(0)
  point!: number;

  @IsDefined()
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
