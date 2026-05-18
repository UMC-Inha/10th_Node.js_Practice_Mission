export abstract class LocationRepositoryInterface {
  abstract findNameById(locationId: bigint): Promise<string | null>;
}
