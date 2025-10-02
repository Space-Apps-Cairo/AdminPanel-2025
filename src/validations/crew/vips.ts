import { z } from "zod";

export const vipValidationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  organization: z.string().min(1, "Organization is required").max(150),
  role: z.string().min(1, "Role is required").max(100),
});