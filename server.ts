import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import ConnectDB from "./config/database.config";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import { localStategy } from "./auth/strategy/local.strategy";
import path from "path";

import authRouter from "./auth/auth.routes";
import userRouter from "./user/user.routes";
import { jwtStrategy } from "./auth/strategy/jwt.strategy";
import isAuthenticated from "./middleware/authMiddleware";
import passport from "passport";

//For env File
dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Passport Strategy
app.use(passport.initialize());
localStategy();
jwtStrategy();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.use("/api/auth", authRouter);
app.use("/api/user", isAuthenticated, userRouter);

//error middleware
app.use(notFound, errorHandler);

const port = process.env.PORT || 8000;

//server
const start = async () => {
  try {
    await ConnectDB();
    app.listen(port, () => console.log(`server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
