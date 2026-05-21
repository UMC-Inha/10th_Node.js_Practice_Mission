import type { Request as ExpressRequest } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  Controller,
  Middlewares,
  Post,
  Request,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { validationMiddleware } from '../../../middlewares/validate.middleware';
import { CreateStoreRequest } from '../dtos/store.dto';
import { StoreService } from '../services/store.service';

@Route('stores')
@Tags('Stores')
@injectable()
export class StoreController extends Controller {
  constructor(
    @inject(StoreService) private readonly storeService: StoreService,
  ) {
    super();
  }

  /**
   * 가게 등록
   */
  @Post()
  @SuccessResponse(StatusCodes.CREATED, 'Created')
  @Middlewares(validationMiddleware(CreateStoreRequest))
  public async createStore(
    @Request() req: ExpressRequest,
  ): Promise<Record<string, unknown>> {
    const body = req.body as CreateStoreRequest;
    const storeId = await this.storeService.createStore(body);
    this.setStatus(StatusCodes.CREATED);
    return { storeId } as unknown as Record<string, unknown>;
  }
}
