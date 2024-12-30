import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../user/models/user.model";

const isAuthenticated = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: true }, (err: any, user: IUser | false, info: { message: string }) => {
    if (err || !user) {
      res.status(401);
      throw new Error("Unauthorized access");
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
});

export default isAuthenticated;
