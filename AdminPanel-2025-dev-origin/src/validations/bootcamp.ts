
import { z } from "zod";

export const BootcampSchema = z.object({
  name: z.any(),
  date: z.any(),
  // هنحوّل القيمة لرقم تلقائيًا ونتأكد إنها >= 1
  total_capacity: z.any()
});

export type BootcampFormData = z.infer<typeof BootcampSchema>;
