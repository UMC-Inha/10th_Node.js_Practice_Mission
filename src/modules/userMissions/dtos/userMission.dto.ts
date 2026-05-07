export type UserMissionStatus = 'PROGRESS' | 'PENDING' | 'SUCCESS';

export interface ChallengeMissionResponse {
  userMissionId: number;
  userId: number;
  missionId: number;
  status: UserMissionStatus;
  createdAt: Date;
}
