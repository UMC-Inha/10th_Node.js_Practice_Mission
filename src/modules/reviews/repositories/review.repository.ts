import { singleton } from 'tsyringe';
import { prisma } from '../../../config/db.config';
import {
  CreateReviewParams,
  ReviewRepositoryInterface,
} from './review.repository.interface';

@singleton()
export class ReviewRepository implements ReviewRepositoryInterface {
  public async createReview(params: CreateReviewParams): Promise<bigint> {
    const created = await prisma.review.create({
      data: {
        user_mission_id: params.userMissionId,
        content: params.content,
        score: params.score ?? null,
        created_at: new Date(),
        user_id: params.userId,
        store_id: params.storeId,
      },
    });
    return created.user_mission_id;
  }
}
