import { Request, Response, NextFunction, RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../common/app-error';

export const validationMiddleware = (dtoClass: any): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const output = plainToInstance(dtoClass, req.body, {
      enableImplicitConversion: true,
    });

    validate(output).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error) => Object.values(error.constraints ?? {}))
          .flat()
          .join(', ');
          // "email must be an email, email should not be empty, name must be a string"


        return next(
          new AppError('VALIDATION_ERROR', message, StatusCodes.BAD_REQUEST)
        );
      }

      req.body = output;
      next();
    });
  };
};
