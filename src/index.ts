import 'reflect-metadata';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { IocContainer } from 'tsoa';
import { container } from 'tsyringe';
import { RegisterRoutes } from './generated/routes';
import {
  globalErrorHandler,
  notFoundHandler,
} from './middlewares/error.middleware';
import { responseEnhancer } from './middlewares/response.middleware';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';

dotenv.config();

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
app.use(responseEnhancer);

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});

RegisterRoutes(app);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`[server] running at http://localhost:${port}`);
});
