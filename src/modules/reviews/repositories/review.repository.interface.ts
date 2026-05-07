export interface CreateReviewParams {
  storeId: number;
  userId: number;
  userMissionId: number;
  content: string;
  score?: number | null;
}

export abstract class ReviewRepositoryInterface {
  abstract createReview(params: CreateReviewParams): Promise<number>;
}
