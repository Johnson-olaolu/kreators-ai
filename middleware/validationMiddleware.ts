import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { AppError } from "../utils/errorHandler";
import expressAsyncHandler from "express-async-handler";

export const validate = (schema: AnyZodObject) => {
  return expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      //   await schema.parseAsync({
      //     body: req.body,
      //     query: req.query,
      //     params: req.params,
      //   });
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError(`Validation failed: \n ${JSON.stringify(error.errors)}`, 400);
      }
      next(error);
    }
  });
};
