export interface CreateReviewParams {
  storeId: bigint;
  userId: bigint;
  userMissionId: bigint;
  content: string;
  score?: number | null;
}

export abstract class ReviewRepositoryInterface {
  abstract createReview(params: CreateReviewParams): Promise<bigint>;
}
