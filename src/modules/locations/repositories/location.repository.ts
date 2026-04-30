import { RowDataPacket } from 'mysql2';
import { singleton } from 'tsyringe';
import { pool } from '../../../config/db.config';
import { LocationRepositoryInterface } from './location.repository.interface';

interface LocationNameRow extends RowDataPacket {
  name: string;
}

@singleton()
export class LocationRepository implements LocationRepositoryInterface {
  public async findNameById(locationId: number): Promise<string | null> {
    const conn = await pool.getConnection();
    try {
      const [rows] = await pool.query<LocationNameRow[]>(
        `SELECT name FROM location WHERE id = ?;`,
        [locationId],
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0]!.name;
    } catch (err) {
      throw new Error(`오류가 발생했어요: ${err}`);
    } finally {
      conn.release();
    }
  }
}
