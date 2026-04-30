import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../../../config/db.config';
import { CreateStoreRequest } from '../dtos/store.dto';
import { StoreRepositoryInterface } from './store.repository.interface';
import { singleton } from 'tsyringe';

interface StoreExistsRow extends RowDataPacket {
  exists_flag: number;
}

@singleton()
export class StoreRepository implements StoreRepositoryInterface {
  public async createStore(store: CreateStoreRequest): Promise<number> {
    const conn = await pool.getConnection();
    try {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO store (user_id, location_id, name, open_at, closed_at) VALUES (?, ?, ?, ?, ?);`,
        [
          store.userId,
          store.locationId,
          store.name,
          store.openAt,
          store.closedAt,
        ]
      );
      return result.insertId;
    } catch (err) {
      throw new Error(`오류 발생: ${err}`);
    } finally {
      conn.release();
    }
  }

  public async existsById(storeId: number): Promise<boolean> {
    const conn = await pool.getConnection();
    try {
      const [rows] = await pool.query<StoreExistsRow[]>(
        `SELECT 1 AS exists_flag FROM store WHERE id = ? AND deleted_at IS NULL LIMIT 1;`,
        [storeId]
      );
      return rows.length > 0;
    } catch (err) {
      throw new Error(`오류가 발생했어요: ${err}`);
    } finally {
      conn.release();
    }
  }
}
