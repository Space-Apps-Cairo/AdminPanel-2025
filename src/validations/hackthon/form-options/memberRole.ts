import { z } from "zod";
export const memberRoleValidationSchema = z.object({
  // optional: usually not sent on create requests; validated if present
  id: z.number().int().positive().optional(),

  // main title (required)
  title: z
    .string()
    .min(1, "Role title is required")
    .max(100, "Role title must not exceed 100 characters"),

  // legacy/compatibility field (optional) — many parts of your UI used `name`
  
  extra_field: z
    .string()
    .max(255, "Extra field must not exceed 255 characters")
    .optional()
    .nullable(),

  // description required
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),

  
  created_at: z
    .string()
    .optional()
    .nullable()
    .refine(
      (v) => v == null || !isNaN(Date.parse(v)),
      { message: "created_at must be a valid datetime string" }
    ),

  updated_at: z
    .string()
    .optional()
    .nullable()
    .refine(
      (v) => v == null || !isNaN(Date.parse(v)),
      { message: "updated_at must be a valid datetime string" }
    ),

  deleted_at: z
    .string()
    .optional()
    .nullable()
    .refine(
      (v) => v == null || !isNaN(Date.parse(v)),
      { message: "deleted_at must be a valid datetime string or null" }
    ),

  // creator relation / id
 created_by_id: z
  .coerce
  .number()
  .int()
  .positive()
  .nullable()
  .optional(),
  // created_by object (can be full user object or null) — keep flexible
  created_by: z.any().nullable().optional(),
});

export type MemberRoleSchema = z.infer<typeof memberRoleValidationSchema>;
