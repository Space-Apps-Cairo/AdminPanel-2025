import { z } from "zod";

export const FormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  formable_type_id: z.string().min(1, { message: "Formable type is required" }),
formable_id: z.string().min(1, { message: "Formable ID is required" }),

  is_active: z.string(),
});

export type FormSchemaType = z.infer<typeof FormSchema>;
