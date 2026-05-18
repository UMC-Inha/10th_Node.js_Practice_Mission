import { CreateStoreRequest } from '../dtos/store.dto';

export abstract class StoreRepositoryInterface {
  abstract createStore(store: CreateStoreRequest): Promise<bigint>;
  abstract existsById(storeId: bigint): Promise<boolean>;
}
