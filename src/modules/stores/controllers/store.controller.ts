import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { StoreService } from '../services/store.service';

@injectable()
export class StoreController {
  constructor(
    @inject(StoreService) private readonly storeService: StoreService
  ) {}

  public handleCreateStore = async (req: Request, res: Response) => {
    const store = await this.storeService.createStore(req.body);
    res.success(store, StatusCodes.CREATED);
  };
}
