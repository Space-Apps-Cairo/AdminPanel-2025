import { z } from "zod";

export const emailTemplateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  type: z.string().min(1, "Type is required"),
});

export const sendEmailSchema = z.object({
  template_id: z.coerce.number().min(1, "Template ID is required"),
  // ids: z.array(z.coerce.number().min(1)).min(1, "At least one ID is required"),
  ids: z.any(),
});

export const sendTestEmailSchema = z.object({
  template_id: z.coerce.number().min(1, "Template ID is required"),
  email: z.string().email("Invalid email address"),
});
