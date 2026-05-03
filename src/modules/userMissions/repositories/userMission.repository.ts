import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { singleton } from 'tsyringe';
import { pool } from '../../../config/db.config';
import {
  CreateUserMissionParams,
  UserMissionRepositoryInterface,
} from './userMission.repository.interface';

interface UserMissionExistsRow extends RowDataPacket {
  exists_flag: number;
}

@singleton()
export class UserMissionRepository implements UserMissionRepositoryInterface {
  public async existsInProgress(
    userId: number,
    missionId: number
  ): Promise<boolean> {
    try {
      const [rows] = await pool.query<UserMissionExistsRow[]>(
        `SELECT 1 AS exists_flag FROM user_mission
         WHERE user_id = ? AND mission_id = ? AND status = 'PROGRESS' AND deleted_at IS NULL
         LIMIT 1;`,
        [userId, missionId]
      );
      return rows.length > 0;
    } catch (err) {
      throw new Error(`오류가 발생했어요: ${err}`);
    }
  }

  public async createUserMission(
    params: CreateUserMissionParams
  ): Promise<number> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO user_mission (created_at, status, mission_id, user_id)
         VALUES (NOW(), 'PROGRESS', ?, ?);`,
        [params.missionId, params.userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('미션 도전에 실패했습니다.');
      }

      return result.insertId;
    } catch (err) {
      throw new Error(`오류가 발생했어요: ${err}`);
    }
  }
}
