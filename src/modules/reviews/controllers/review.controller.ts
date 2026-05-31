import type { Request as ExpressRequest } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  Controller,
  Middlewares,
  Path,
  Post,
  Request,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { STORE_ERROR_CODE } from '../../../common/error-code';
import { routeParamToPositiveBigInt } from '../../../common/id-string';
import { validationMiddleware } from '../../../middlewares/validate.middleware';
import { CreateReviewRequest } from '../dtos/review.dto';
import { ReviewService } from '../services/review.service';

@Route('stores')
@Tags('Reviews')
@injectable()
export class ReviewController extends Controller {
  constructor(
    @inject(ReviewService) private readonly reviewService: ReviewService,
  ) {
    super();
  }

  /**
   * 가게에 리뷰 추가하기
   */
  @Post('{storeId}/reviews')
  @SuccessResponse(StatusCodes.CREATED, 'Created')
  @Middlewares(validationMiddleware(CreateReviewRequest))
  public async createReviewForStore(
    @Path() storeId: string,
    @Request() req: ExpressRequest,
  ): Promise<Record<string, unknown>> {
    const parsedStoreId = routeParamToPositiveBigInt(
      storeId,
      STORE_ERROR_CODE.STORE_NOT_FOUND,
      '유효하지 않은 가게 id 입니다.',
    );

    const body = req.body as CreateReviewRequest;
    const review = await this.reviewService.createReview(parsedStoreId, body);
    this.setStatus(StatusCodes.CREATED);
    return review as unknown as Record<string, unknown>;
  }
}
