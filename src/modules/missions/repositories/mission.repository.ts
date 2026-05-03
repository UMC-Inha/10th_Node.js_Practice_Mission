import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { singleton } from 'tsyringe';
import { pool } from '../../../config/db.config';
import {
  CreateMissionParams,
  MissionRepositoryInterface,
} from './mission.repository.interface';

interface MissionExistsRow extends RowDataPacket {
  exists_flag: number;
}

@singleton()
export class MissionRepository implements MissionRepositoryInterface {
  public async createMission(params: CreateMissionParams): Promise<number> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO mission (price, point, end_at, created_at, store_id)
         VALUES (?, ?, ?, NOW(), ?);`,
        [params.price, params.point, params.endAt, params.storeId],
      );

      if (result.affectedRows === 0) {
        throw new Error('미션 추가에 실패했습니다.');
      }

      return result.insertId;
    } catch (err) {
      throw new Error(`오류가 발생했어요: ${err}`);
    }
  }

  public async existsById(missionId: number): Promise<boolean> {
    try {
      const [rows] = await pool.query<MissionExistsRow[]>(
        `SELECT 1 AS exists_flag FROM mission WHERE id = ? AND deleted_at IS NULL LIMIT 1;`,
        [missionId],
      );
      return rows.length > 0;
    } catch (err) {
      throw new Error(`오류가 발생했어요: ${err}`);
    }
  }
}
