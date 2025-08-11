import { z } from "zod";

export const BootcampSchema = z.object({
  name: z.string().min(3, "Name is required"),
  date: z.string().min(1, "Date is required"),
  total_capacity: z
    .number()
    .min(1, "Capacity must be at least 1")
    .refine((val) => !isNaN(val), {
      message: "Capacity must be a number",
    }),
});

export type BootcampFormData = z.infer<typeof BootcampSchema>;
