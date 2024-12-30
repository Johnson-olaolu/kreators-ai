import { Router } from "express";
import { login, register, sendVerifyEmail, verifyEmail } from "./auth.controller";
import { validate } from "../middleware/validationMiddleware";
import { registerSchema } from "./dto/register.dto";
import { loginSchema } from "./dto/login.dto";

const router = Router();

// Public routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/verify-email/send", sendVerifyEmail);
router.get("/verify-email/confirm", verifyEmail);

export default router;
