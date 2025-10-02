
import { z } from "zod";
  
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const judgeValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  expertise: z.string().min(1, "Expertise is required"),
  title: z.string().min(1, "Title is required"),
  uuid: z.string().uuid("Invalid UUID"),
 jude_before_at: z.preprocess((val) => {
      if (typeof val === "string" || val instanceof Date) {
        return new Date(val);
      }
      return val;
    }, z.date())
    .transform((date) => formatDate(date)),
  email: z.string().email("Invalid email"),
  linkedIn: z.string().url("Invalid URL").optional().nullable(),
  phone: z.string().optional().nullable(),
  judging_area: z.string().min(1, "Judging area is required"),
  reached_out_by_call: z.boolean().optional(),
  confirmed_status: z.boolean().optional(),
  response_status: z.enum([
    "responded_via_call",
    "responded_via_email_linkedin",
    "did_not_respond",
    "cancelled_via_email_linkedin",
    "pending",
  ]).optional(),
});
