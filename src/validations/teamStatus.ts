import { z } from "zod";

export const teamStatusValidationSchema = z.object({
  label: z.string().min(1, { message: "Label is required." }),
  key: z.string().min(1, { message: "Key is required." }),
});