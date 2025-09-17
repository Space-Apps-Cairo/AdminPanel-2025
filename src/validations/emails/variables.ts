import z from "zod";

export const emailTemplateVariableSchema = z.object({
  key: z.string().min(1, "Key is required"),
  label: z.string().min(1, "Label is required"),
  source: z.string().min(1, "Source is required"),
  type: z.string().min(1, "Type is required"),
});
