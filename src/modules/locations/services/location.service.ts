import { inject, singleton } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import { LocationRepository } from '../repositories/location.repository';
import { LocationRepositoryInterface } from '../repositories/location.repository.interface';
import { AppError } from '../../../common/app-error';
import { LOCATION_ERROR_CODE } from '../../../common/error-code';

@singleton()
export class LocationService {
  constructor(
    @inject(LocationRepository)
    private readonly locationRepository: LocationRepositoryInterface,
  ) {}

  public async getLocationNameById(locationId: bigint): Promise<string> {
    const name = await this.locationRepository.findNameById(locationId);

    if (name === null) {
      throw new AppError(
        LOCATION_ERROR_CODE.LOCATION_NOT_FOUND,
        `존재하지 않는 지역입니다. (id: ${locationId})`,
        StatusCodes.NOT_FOUND,
      );
    }

    return name;
  }
}
