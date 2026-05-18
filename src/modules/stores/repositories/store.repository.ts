import { singleton } from 'tsyringe';
import { prisma } from '../../../config/db.config';
import { CreateStoreRequest } from '../dtos/store.dto';
import { StoreRepositoryInterface } from './store.repository.interface';

const defaultClock = (hour: number, minute = 0, second = 0) =>
  new Date(1970, 0, 1, hour, minute, second);

@singleton()
export class StoreRepository implements StoreRepositoryInterface {
  public async createStore(store: CreateStoreRequest): Promise<bigint> {
    const row = await prisma.store.create({
      data: {
        user_id: store.userId,
        name: store.name,
        open_at: store.openAt ?? defaultClock(9, 0, 0),
        closed_at: store.closedAt ?? defaultClock(22, 0, 0),
        created_at: store.createdAt ?? new Date(),
        deleted_at: store.deletedAt ?? null,
      },
    });
    return row.id;
  }

  public async existsById(storeId: bigint): Promise<boolean> {
    const row = await prisma.store.findFirst({
      where: { id: storeId, deleted_at: null },
      select: { id: true },
    });
    return row !== null;
  }
}
