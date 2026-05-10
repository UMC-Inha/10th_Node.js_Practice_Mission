import { inject, singleton } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import { ReviewRepository } from '../repositories/review.repository';
import { ReviewRepositoryInterface } from '../repositories/review.repository.interface';
import {
  CreateReviewRequest,
  CreateReviewResponse,
} from '../dtos/review.dto';
import { StoreService } from '../../stores/services/store.service';
import { UserMissionRepository } from '../../userMissions/repositories/userMission.repository';
import { UserMissionRepositoryInterface } from '../../userMissions/repositories/userMission.repository.interface';
import { AppError } from '../../../common/app-error';
import { REVIEW_ERROR_CODE } from '../../../common/error-code';

@singleton()
export class ReviewService {
  constructor(
    @inject(ReviewRepository)
    private readonly reviewRepository: ReviewRepositoryInterface,
    @inject(StoreService)
    private readonly storeService: StoreService,
    @inject(UserMissionRepository)
    private readonly userMissionRepository: UserMissionRepositoryInterface,
  ) {}

  public async createReview(
    storeId: number,
    data: CreateReviewRequest,
  ): Promise<CreateReviewResponse> {
    await this.storeService.ensureStoreExists(storeId);

    const missionMatchesStore =
      await this.userMissionRepository.userMissionBelongsToStore(
        data.userId,
        data.userMissionId,
        storeId,
      );

    if (!missionMatchesStore) {
      throw new AppError(
        REVIEW_ERROR_CODE.USER_MISSION_MISMATCH,
        '이 가게의 미션에 연결된 사용자 미션이 아니거나, 권한이 없습니다.',
        StatusCodes.BAD_REQUEST,
      );
    }

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
