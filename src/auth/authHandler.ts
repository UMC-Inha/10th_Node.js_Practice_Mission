import jwt from "jsonwebtoken";
import { CustomError } from "../common/errors/custom.error.js";

export const authHandler = (request: any) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new CustomError(401, "토큰 없음");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new CustomError(401, "토큰 형식 오류");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    return {
      userId: decoded.userId,
    };
  } catch {
    throw new CustomError(401, "토큰 검증 실패");
  }
};