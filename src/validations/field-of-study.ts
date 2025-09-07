import { z } from "zod";

export const FieldOfStudySchema = z.object({
  name: z.string().min(1, "Required"),
});
