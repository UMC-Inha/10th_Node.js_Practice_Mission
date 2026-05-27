import 'reflect-metadata';
import express, { Request, Response } from 'express';
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
import { googleStrategy } from './auth.config';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';

dotenv.config();

passport.use(googleStrategy);

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

app.get('/login-failed', (_req: Request, res: Response) => {
  res.status(401).json({ success: false, message: 'Google 로그인에 실패했습니다.' });
});

RegisterRoutes(app);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`[server] running at http://localhost:${port}`);
});
