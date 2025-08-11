// src/validations/participantSchema.ts
import { z } from "zod";

export const participantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, "Invalid Egyptian phone number"),
  status: z
    .string()
    .min(1, "Status is required")
    .refine((val) => ["active", "inactive"].includes(val), {
      message: "Invalid status",
    }),
});

export type ParticipantFormValues = z.infer<typeof participantSchema>;
