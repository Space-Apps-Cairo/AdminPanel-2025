// src/validations/hackathon/memberRolesSchema.ts
import { z } from "zod";

export const memberRolesSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(255),
  description: z.string().optional().nullable(),
});

export type MemberRoleFormValues = z.infer<typeof memberRolesSchema>;
