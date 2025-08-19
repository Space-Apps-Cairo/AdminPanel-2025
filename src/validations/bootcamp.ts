import { format } from "date-fns";
import { z } from "zod";

export const BootcampSchema = z.object({
  name: z.string().min(3, "Name is required"),
  date: z.date().transform((val) => format(val, "yyyy-MM-dd HH:mm:ss")),
  total_capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1")
    .refine((val) => !isNaN(val), {
      message: "Capacity must be a number",
    }),
});

export type BootcampFormData = z.infer<typeof BootcampSchema>;
