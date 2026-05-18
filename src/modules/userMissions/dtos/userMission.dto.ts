export type UserMissionStatus = 'PROGRESS' | 'PENDING' | 'SUCCESS';

export interface ChallengeMissionResponse {
  userMissionId: bigint;
  userId: bigint;
  missionId: bigint;
  status: UserMissionStatus;
  createdAt: Date;
}
