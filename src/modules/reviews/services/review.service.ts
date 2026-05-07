import { inject, singleton } from 'tsyringe';
import { ReviewRepository } from '../repositories/review.repository';
import { ReviewRepositoryInterface } from '../repositories/review.repository.interface';
import {
  CreateReviewRequest,
  CreateReviewResponse,
} from '../dtos/review.dto';
import { StoreService } from '../../stores/services/store.service';

@singleton()
export class ReviewService {
  constructor(
    @inject(ReviewRepository)
    private readonly reviewRepository: ReviewRepositoryInterface,
    @inject(StoreService)
    private readonly storeService: StoreService,
  ) {}

  public async createReview(
    storeId: number,
    data: CreateReviewRequest,
  ): Promise<CreateReviewResponse> {
    // 가게가 존재하는지 검증
    await this.storeService.ensureStoreExists(storeId);

    const reviewId = await this.reviewRepository.createReview({
      storeId,
      userId: data.userId,
      userMissionId: data.userMissionId,
      content: data.content,
      score: data.score ?? null,
    });

    return {
      reviewId,
      storeId,
      userId: data.userId,
      userMissionId: data.userMissionId,
      content: data.content,
      score: data.score ?? null,
      createdAt: new Date(),
    };
  }
}
