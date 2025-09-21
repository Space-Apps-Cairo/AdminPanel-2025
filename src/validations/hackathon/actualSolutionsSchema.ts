import { z } from "zod";

export const actualSolutionsSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title too long")
    .nonempty("Title is required"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .nonempty("Description is required"),
});

export type ActualSolutionsSchema = z.infer<typeof actualSolutionsSchema>;
