import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { singleton } from 'tsyringe';
import { pool } from '../../../config/db.config';
import { UserRepositoryInterface } from './user.repository.interface';
import { UserSignUpRequest } from '../dtos/userSignUpRequest.dto';
import { UserSignUpResponse } from '../dtos/UserSignUpResponse.dto';

@singleton()
export class UserRepository implements UserRepositoryInterface {
  // 1. 사용자 추가
  public async addUser(data: UserSignUpRequest): Promise<number> {
    const conn = await pool.getConnection();
    try {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO user (email, name, gender, birth, address, detail_address, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          data.email,
          data.name,
          data.gender,
          data.birth,
          data.address,
          data.detailAddress,
          data.phoneNumber,
        ]
      );

      if (result.affectedRows === 0) {
        throw new Error('사용자 추가에 실패했습니다.');
      }

      return result.insertId;
    } catch (err) {
      throw new Error(`오류가 발생했어요: ${err}`);
    } finally {
      conn.release();
    }
  }

  // 2. 사용자 정보 얻기
  public async getUser(userId: number): Promise<any | null> {
    const conn = await pool.getConnection();

    try {
      const [user] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM user WHERE id = ?;`,
        [userId]
      );

      if (user.length === 0) {
        return null;
      }

      return user[0];
    } catch (err) {
      throw new Error(`오류가 발생했어요: ${err}`);
    } finally {
      conn.release();
    }
  }

  // 3. 음식 선호 카테고리 매핑
  public async setPreference(
    userId: number,
    foodCategoryId: number
  ): Promise<void> {
    const conn = await pool.getConnection();

    try {
      await pool.query(
        `INSERT INTO user_favor_category (food_category_id, user_id) VALUES (?, ?);`,
        [foodCategoryId, userId]
      );
    } catch (err) {
      throw new Error(`오류가 발생했어요: ${err}`);
    } finally {
      conn.release();
    }
  }

  // 4. 사용자 선호 카테고리 반환
  public async getUserPreferencesByUserId(userId: number): Promise<any[]> {
    const conn = await pool.getConnection();

    try {
      const [preferences] = await pool.query<RowDataPacket[]>(
        'SELECT ufc.id, ufc.food_category_id, ufc.user_id, fcl.name ' +
          'FROM user_favor_category ufc JOIN food_category fcl on ufc.food_category_id = fcl.id ' +
          'WHERE ufc.user_id = ? ORDER BY ufc.food_category_id ASC;',
        [userId]
      );

      return preferences as any[];
    } catch (err) {
      throw new Error(`오류가 발생했어요: ${err}`);
    } finally {
      conn.release();
    }
  }
}
