import { z } from "zod";

export const studyLevelValidationSchema = z.object({
  id: z.number().optional(), 
  title: z
    .string()
    .min(5, "Title must be at least 5 characters"),
  extra_field: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 5,
      { message: "Extra Info must be at least 5 characters" }
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
});
