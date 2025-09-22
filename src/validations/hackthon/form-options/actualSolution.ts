import { z } from "zod";

export const actualSolutionValidationSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  teamId: z.number().min(1, "Team is required"),
});

export type ActualSolutionSchema = z.infer<typeof actualSolutionValidationSchema>;
