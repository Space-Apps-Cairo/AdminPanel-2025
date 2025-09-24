import { z } from "zod";

export const memberRoleValidationSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(100, "Role name must not exceed 100 characters"),
});

export type MemberRoleSchema = z.infer<typeof memberRoleValidationSchema>;
