import { z } from "zod";

export const tshirtValidationSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" }),

  extra_field: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 5,
      { message: "Extra Info must be at least 5 characters" }
    ),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
});

export type TShirtValidationType = z.infer<typeof tshirtValidationSchema>;
