import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../user/models/user.model";
import { AppError } from "../utils/errorHandler";

const isAuthenticated = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: true }, (err: any, user: IUser | false, info: { message: string }) => {
    try {
      if (err || !user) {
        res.status(401);
        throw new AppError("Unauthorized access", 401);
      } else {
        req.user = user;
        next();
      }
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

export default isAuthenticated;
