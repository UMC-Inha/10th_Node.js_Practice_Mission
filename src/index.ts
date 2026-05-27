import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";

import { RegisterRoutes } from "./generated/routes.js";
import passport from "passport";
import { googleStrategy, githubStrategy, jwtStrategy, localStrategy } from "./auth.config.js";
import { ApiResponse } from "./common/responses/api.response.js";

// 환경 변수 설정
dotenv.config();

passport.use(googleStrategy);
passport.use(githubStrategy); 
passport.use(jwtStrategy);
passport.use(localStrategy);

const app: Express = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함(JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(passport.initialize());

// Swagger 설정
const swaggerFile = JSON.parse(
  fs.readFileSync(
    path.resolve("dist/swagger.json"),
    "utf8",
  ),
);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile),
);

// Express.js에 생성한 엔드 포인트들을 register
const router = express.Router();
RegisterRoutes(router); 
app.use("/api/v1", router);

const isLogin = passport.authenticate("jwt", {
  session: false,
});

app.get("/mypage", isLogin, (req, res) => {
  return res.status(200).json(
    ApiResponse.success(
      200,
      `인증 성공! ${(req.user as any).name}님의 마이페이지입니다.`,
      {
        user: req.user,
      }
    )
  );
});

// 서버 시작
app.listen(port, () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);
});
