import { singleton } from 'tsyringe';
import { prisma } from '../../../config/db.config';
import { LocationRepositoryInterface } from './location.repository.interface';

@singleton()
export class LocationRepository implements LocationRepositoryInterface {
  public async findNameById(locationId: number): Promise<string | null> {
    const row = await prisma.location.findUnique({
      where: { id: BigInt(locationId) },
      select: { name: true },
    });
    return row?.name ?? null;
  }
}
