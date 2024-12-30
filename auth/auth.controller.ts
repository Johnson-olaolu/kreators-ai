import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { User, IUser } from "../user/models/user.model";
import { AppError } from "../utils/errorHandler";
import passport from "passport";
import jwt from "jsonwebtoken";
import { LoginDto } from "./dto/login.dto";
import { sendVerificationEmail, sendWelcomeEmail } from "../services/mail.service";
import { RegisterDto } from "./dto/register.dto";
import { Device } from "./models/device.model";

// Register new user
export const register = expressAsyncHandler(async (req: Request<{}, {}, RegisterDto>, res: Response) => {
  const { email, password, firstName, lastName, deviceId, deviceName } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  // Create user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
  });

  if (user) {
    let token = "";
    const foundDevice = await Device.findOne({ email: user.email, deviceId });
    if (foundDevice) {
      token = foundDevice.token;
    } else {
      const newDevice = await Device.create({
        email: email,
        deviceId,
        deviceName,
        token: jwt.sign({ user: { id: user._id, email: user.email }, deviceId }, process.env.JWT_SECRET || ""),
      }).catch((err) => {
        throw new AppError(err.message, 500);
      });
      token = newDevice.token;
    }

    // send welcome email
    const registrationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET || "", { expiresIn: "1h" });
    const verificationUrl = `${process.env.SITE_URL}/api/auth/verify-email/confirm?token=${registrationToken}`;
    sendWelcomeEmail(user.email, verificationUrl);

    res.status(201).json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    });
  } else {
    throw new AppError("Invalid user data", 400);
  }
});

// Login user
export const login = expressAsyncHandler(async (req: Request<{}, {}, LoginDto>, res: Response, next: NextFunction) => {
  passport.authenticate("local", async (err: any, user: IUser | false, info: { message: string }) => {
    try {
      if (err || !user) {
        const error = new Error(info.message);
        res.status(400);
        return next(error);
      }
      req.login(user, { session: false }, async (error: Error | null) => {
        if (error) return next(error);
        const body = { id: user._id, email: user.email };
        let token = "";
        const foundDevice = await Device.findOne({ email: user.email, deviceId: req.body.deviceId });
        if (foundDevice) {
          token = foundDevice.token;
        } else {
          const newDevice = await Device.create({
            email: user.email,
            deviceId: req.body.deviceId,
            deviceName: req.body.deviceName,
            token: jwt.sign({ user: body, deviceId: req.body.deviceId }, process.env.JWT_SECRET || ""),
          }).catch((err) => {
            throw new AppError(err.message, 500);
          });
          token = newDevice.token;
        }
        return res.json({
          success: true,
          message: "User Logged in successfully",
          token: token,
          user: user,
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

export const sendVerifyEmail = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email } = req.query;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User already exists", 400);
  }
  const registrationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET || "", { expiresIn: "1h" });
  const verificationUrl = `${process.env.SITE_URL}/api/auth/verify-email/confirm?token=${registrationToken}`;
  sendVerificationEmail(user.email, verificationUrl);

  res.json({ message: "Verification email sent" });
});

export const verifyEmail = expressAsyncHandler(async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token) {
    throw new AppError("Invalid token", 400);
  }

  jwt.verify(token as string, process.env.JWT_SECRET || "", async (err, decoded) => {
    if (err) {
      throw new AppError("Invalid token", 400);
    }

    const { email } = decoded as { email: string };
    const user = await User.findOneAndUpdate({ email }, { isVerified: true });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.json({ message: "Email verified successfully" });
  });
});

export const getDevices = expressAsyncHandler(async (req: Request, res: Response) => {
  const devices = await Device.find({ email: (req.user as IUser)?.email });
  res.json({ message: " Devices fetched successfully", devices });
});

export const deleteDevice = expressAsyncHandler(async (req: Request, res: Response) => {
  const { deviceId } = req.params;
  const device = await Device.deleteOne({ deviceId });
  res.json({ message: "Device deleted successfully", device });
});
