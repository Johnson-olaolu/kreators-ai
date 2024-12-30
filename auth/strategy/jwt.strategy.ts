import passport from "passport";
import { Strategy as JWTstrategy, ExtractJwt } from "passport-jwt";
import { User } from "../../user/models/user.model";
import { Device } from "../models/device.model";

export const jwtStrategy = () =>
  passport.use(
    new JWTstrategy(
      {
        secretOrKey: process.env.JWT_SECRET || "",
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (token, done) => {
        const device = await Device.findOne({ email: token.user.email, deviceId: token.deviceId });
        if (!device) {
          return done(null, false, { message: "Invalid username" });
        }
        const user = await User.findOne({ email: token.user.email });
        if (!user) {
          return done(null, false, { message: "Invalid username" });
        }
        return done(null, user);
      }
    )
  );
