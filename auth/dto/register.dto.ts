import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  deviceId: z.string(),
  deviceName: z.string(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
