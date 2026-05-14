import 'reflect-metadata';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { container } from 'tsyringe';
import { UserController } from './modules/users/controllers/user.controller';
import { ReviewController } from './modules/reviews/controllers/review.controller';
import { MissionController } from './modules/missions/controllers/mission.controller';
import { UserMissionController } from './modules/userMissions/controllers/userMission.controller';
import { validationMiddleware } from './middlewares/validate.middleware';
import { UserSignUpRequest } from './modules/users/dtos/userSignUpRequest.dto';
import { CreateReviewRequest } from './modules/reviews/dtos/review.dto';
import { CreateMissionRequest } from './modules/missions/dtos/mission.dto';
import {
  globalErrorHandler,
  notFoundHandler,
} from './middlewares/error.middleware';
import { responseEnhancer } from './middlewares/response.middleware';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(responseEnhancer);

const userController = container.resolve(UserController);
const reviewController = container.resolve(ReviewController);
const missionController = container.resolve(MissionController);
const userMissionController = container.resolve(UserMissionController);

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});

app.post(
  '/api/v1/users/signup',
  validationMiddleware(UserSignUpRequest),
  userController.handleUserSignUp
);

// 가게에 리뷰 추가하기
app.post(
  '/api/v1/stores/:storeId/reviews',
  validationMiddleware(CreateReviewRequest),
  reviewController.handleCreateReviewForStore
);

// 가게에 미션 추가하기
app.post(
  '/api/v1/stores/:storeId/missions',
  validationMiddleware(CreateMissionRequest),
  missionController.handleCreateMissionForStore
);

// 미션 도전하기 (도전 중인 미션에 추가)
app.post(
  '/api/v1/missions/:missionId/challenges',
  userMissionController.handleChallengeMission
);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`[server] running at http://localhost:${port}`);
});
