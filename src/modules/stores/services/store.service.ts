import { inject, singleton } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import { StoreRepository } from '../repositories/store.repository';
import { StoreRepositoryInterface } from '../repositories/store.repository.interface';
import { CreateStoreRequest } from '../dtos/store.dto';
import { LocationService } from '../../locations/services/location.service';
import { AppError } from '../../../common/app-error';
import { STORE_ERROR_CODE } from '../../../common/error-code';

@singleton()
export class StoreService {
  constructor(
    @inject(StoreRepository)
    private readonly storeRepository: StoreRepositoryInterface,
    @inject(LocationService)
    private readonly locationService: LocationService
  ) {}

  public async createStore(store: CreateStoreRequest): Promise<number> {
    await this.locationService.getLocationNameById(store.locationId);
    const newStoreId = await this.storeRepository.createStore(store);
    return newStoreId;
  }

  public async ensureStoreExists(storeId: number): Promise<void> {
    const exists = await this.storeRepository.existsById(storeId);

    if (!exists) {
      throw new AppError(
        STORE_ERROR_CODE.STORE_NOT_FOUND,
        `존재하지 않는 가게입니다. (id: ${storeId})`,
        StatusCodes.NOT_FOUND
      );
    }
  }
}
