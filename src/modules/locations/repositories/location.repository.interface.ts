export abstract class LocationRepositoryInterface {
  abstract findNameById(locationId: number): Promise<string | null>;
}
