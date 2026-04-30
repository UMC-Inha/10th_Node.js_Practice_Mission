import { ResultSetHeader } from 'mysql2';
import { singleton } from 'tsyringe';
import { pool } from '../../../config/db.config';
import {
  CreateReviewParams,
  ReviewRepositoryInterface,
} from './review.repository.interface';

@singleton()
export class ReviewRepository implements ReviewRepositoryInterface {
  public async createReview(params: CreateReviewParams): Promise<number> {
    const conn = await pool.getConnection();
    try {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO review (user_mission_id, content, score, created_at, user_id, store_id)
         VALUES (?, ?, ?, NOW(), ?, ?);`,
        [
          params.userMissionId,
          params.content,
          params.score ?? null,
          params.userId,
          params.storeId,
        ],
      );

      if (result.affectedRows === 0) {
        throw new Error('리뷰 추가에 실패했습니다.');
      }

      return result.insertId;
    } catch (err) {
      throw new Error(`오류가 발생했어요: ${err}`);
    } finally {
      conn.release();
    }
  }
}
