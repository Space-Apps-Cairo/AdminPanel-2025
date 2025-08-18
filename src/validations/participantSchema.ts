import { z } from "zod";
import { isValidPhoneNumber } from "@/lib/utils";

export const participantValidationSchema = z.object({
  name_ar: z.string().min(1, "Arabic name is required"),
  name_en: z.string().min(1, "English name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => isValidPhoneNumber(val), {
      message: "Invalid phone number format",
    }),
  birth_date: z.string().min(1, "Birth date is required"),
  nationality: z.string().min(1, "Nationality is required"),
  governorate: z.string().min(1, "Governorate is required"),
  educational_institute: z.string().min(1, "Educational institute is required"),
  graduation_year: z.string().min(1, "Graduation year is required"),
  current_occupation: z.string().min(1, "Current occupation is required"),
  national_id: z.string().min(1, "National ID is required"),
  educational_level_id: z.string().min(1, "Educational level is required"),
  field_of_study_id: z.string().min(1, "Field of study is required"),
  is_have_team: z.enum(["individual", "team"]),
  participation_status: z.string().min(1, "Participation status is required"),
  participated_years: z.string().optional(),
  attend_workshop: z.number().int().min(0).max(1),
  why_this_workshop: z.string().optional(),
  comment: z.string().optional(),
  year: z.string().optional(),
  // File fields would be handled separately in FormData
});

export type ParticipantFormValues = z.infer<typeof participantValidationSchema>;
