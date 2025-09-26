import { z } from "zod";

export const mentorshipValidationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
 extra_field: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 5,
      { message: "Extra Info must be at least 5 characters" }
    ),
});
