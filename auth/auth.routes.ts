import { Router } from "express";
import { deleteDevice, getDevices, login, register, sendVerifyEmail, verifyEmail } from "./auth.controller";
import { validate } from "../middleware/validationMiddleware";
import { registerSchema } from "./dto/register.dto";
import { loginSchema } from "./dto/login.dto";
import isAuthenticated from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("refresh-token", login);
router.get("/verify-email/send", sendVerifyEmail);
router.get("/verify-email/confirm", verifyEmail);

router.get("/device", isAuthenticated, getDevices);
router.delete("/device/:deviceId", isAuthenticated, deleteDevice);

export default router;
