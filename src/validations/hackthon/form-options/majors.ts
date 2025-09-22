import z from "zod";

export interface MajorType {
  id: number;
  title: string;
  extra_field?: string;
  description: string;
  created_at: string;
  created_by_id: number;
}

export const majorSchema = z.object({
  title: z.string().min(5, { message: "title must be at least 5 characters" }),
  description: z.string().min(1, { message: "description is required" }),
 extra_field: z
     .string()
     .optional()
     .refine(
       (val) => !val || val.length >= 5,
       { message: "Extra Info must be at least 5 characters" }
     ),
});
