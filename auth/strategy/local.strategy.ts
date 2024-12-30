import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { IUser, User } from "../../user/models/user.model";

export const localStategy = () =>
  passport.use(
    new LocalStrategy(async function (
      username: string,
      password: string,
      done: (error: any, user?: IUser | false, options?: { message: string }) => void
    ) {
      const user = await User.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: "Invalid username" });
      }
      if (!(await user.comparePassword(password))) {
        return done(null, false, { message: "Invalid password" });
      }
      return done(null, user);
    })
  );
