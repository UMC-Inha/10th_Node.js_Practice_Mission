import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../errors/custom.error.js";

interface JwtPayload {
  userId: number;
}

export const isLogin = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new CustomError(401, "토큰 없음");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new CustomError(401, "토큰 형식 오류");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload;

    (req as any).user = {
      userId: decoded.userId,
    };

    next();
  } catch (err) {
    next(err);
  }
};