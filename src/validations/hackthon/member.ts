// src/validation/memberSchema.ts
import { z } from "zod";

export const memberSchema = z.object({
  national: z
    .string()
    .min(8, "National ID must be at least 8 characters")
    .max(20, "National ID too long"),
  name: z.string().min(3, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().regex(/^[0-9+\-() ]+$/, "Invalid phone number"),
  age: z.number(),
  is_new: z.boolean(),
  member_role: z.string(),
  tshirt_size_id: z.number().int(),
  major_id: z.number().int(),
  organization: z.string().min(2),
  participant_type: z.string(),
  study_level_id: z.number().int(),
  extra_field: z.string().optional(),
  notes: z.string().optional(),
});

// For request validation
export type MemberRequestSchema = z.infer<typeof memberSchema>;
