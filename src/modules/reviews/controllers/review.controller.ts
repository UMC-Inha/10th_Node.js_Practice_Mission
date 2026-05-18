import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ReviewService } from '../services/review.service';
import { STORE_ERROR_CODE } from '../../../common/error-code';
import { routeParamToPositiveBigInt } from '../../../common/id-string';

@injectable()
export class ReviewController {
  constructor(
    @inject(ReviewService) private readonly reviewService: ReviewService,
  ) {}

  public handleCreateReviewForStore = async (req: Request, res: Response) => {
    const storeId = routeParamToPositiveBigInt(
      req.params.storeId,
      STORE_ERROR_CODE.STORE_NOT_FOUND,
      '유효하지 않은 가게 id 입니다.',
    );

    const review = await this.reviewService.createReview(storeId, req.body);
    res.success(review, StatusCodes.CREATED);
  };
}
