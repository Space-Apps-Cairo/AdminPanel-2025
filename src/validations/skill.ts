import { z } from "zod";

export const SkillSchema = z.object({
  name: z.any(),
  type: z.any(),
});
