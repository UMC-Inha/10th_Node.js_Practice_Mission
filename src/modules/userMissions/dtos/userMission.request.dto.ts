import { IsNumber } from "class-validator";

export class ChallengeMissionRequest {

  /**
   * 사용자 ID
   * @example 1
   */
  @IsNumber()
  userId!: number;
}