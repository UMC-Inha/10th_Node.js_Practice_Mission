import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import { IocContainer } from 'tsoa';
import { container } from 'tsyringe';
import { RegisterRoutes } from './generated/routes';
import {
  globalErrorHandler,
  notFoundHandler,
} from './middlewares/error.middleware';
import { responseEnhancer } from './middlewares/response.middleware';
import {
  googleStrategy,
  naverStrategy,
  localStrategy,
  localSignUp,
  generateAccessToken,
  generateRefreshToken,
} from './auth.config';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';

dotenv.config();

passport.use(googleStrategy);
passport.use(naverStrategy);
passport.use(localStrategy);

export const iocContainer: IocContainer = {
  get<T>(controller: new (...args: unknown[]) => T): T {
    return container.resolve<T>(controller);
  },
};

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));

app.use(cookieParser());
app.use(
  compression({
    threshold: 512,
    level: 6,
  }),
);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(responseEnhancer);

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});

app.get(
  '/oauth2/login/google',
  passport.authenticate('google', { session: false }),
);

app.get(
  '/oauth2/callback/google',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login-failed',
  }),
  (req: Request, res: Response) => {
    res.status(200).json({ success: true, tokens: req.user });
  },
);

app.get(
  '/oauth2/login/naver',
  passport.authenticate('naver', { session: false }),
);

app.get(
  '/oauth2/callback/naver',
  passport.authenticate('naver', {
    session: false,
    failureRedirect: '/login-failed',
  }),
  (req: Request, res: Response) => {
    res.status(200).json({ success: true, tokens: req.user });
  },
);

app.post(
  '/auth/signup',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body ?? {};
      if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'email과 password는 필수입니다.',
        });
      }
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: '비밀번호는 8자 이상이어야 합니다.',
        });
      }

      const user = await localSignUp({ email, password, name });
      const tokens = {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
      };
      return res
        .status(201)
        .json({ success: true, user: { email: user.email, name: user.name }, tokens });
    } catch (err) {
      return next(err);
    }
  },
);

app.post('/auth/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'local',
    { session: false },
    (err: Error | null, tokens: unknown, info?: { message?: string }) => {
      if (err) return next(err);
      if (!tokens) {
        return res.status(401).json({
          success: false,
          message: info?.message ?? '이메일 또는 비밀번호가 올바르지 않습니다.',
        });
      }
      return res.status(200).json({ success: true, tokens });
    },
  )(req, res, next);
});

app.get('/login-failed', (_req: Request, res: Response) => {
  res.status(401).json({ success: false, message: '소셜 로그인에 실패했습니다.' });
});

RegisterRoutes(app);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`[server] running at http://localhost:${port}`);
});
