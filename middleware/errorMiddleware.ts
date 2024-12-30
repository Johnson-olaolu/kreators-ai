import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(err);
};

interface CustomError extends Error {
  errors?: Array<{ message: string }>;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: {
      success: false,
      message: err.errors ? err.errors[0].message : err.message,
    },
    stack: err.stack,
  });
};
