import { CreateStoreRequest } from '../dtos/store.dto';

export abstract class StoreRepositoryInterface {
  abstract createStore(store: CreateStoreRequest): Promise<number>; // id 반환
  abstract existsById(storeId: number): Promise<boolean>;
}
