import { z } from "zod";

export const EducationLevelSchema = z.object({
  name: z.string().min(1, "Required"),
});
