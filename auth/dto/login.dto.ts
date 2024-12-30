import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  deviceId: z.string(),
  deviceName: z.string(),
});

export type LoginDto = z.infer<typeof loginSchema>;
