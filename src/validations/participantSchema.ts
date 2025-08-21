import { z } from "zod";
import { isValidPhoneNumber } from "@/lib/utils";

export const participantValidationSchema = z.object({
  name_ar: z.string().min(1, "Arabic name is required"),
  name_en: z.string().min(1, "English name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  nationality: z
    .string({ message: "Nationality must be a string" })
    .min(1, "Nationality  is required"),
  national_id: z.coerce
    .number({ message: "national_id must be a number" })
    .min(1, "National ID is required"),
  birth_date: z.coerce
    .string()
    .min(1, "Birth date is required")
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  age: z.coerce.number().min(1, "Age is required"),
  governorate: z.string().min(1, "Governorate is required"),
  current_occupation: z.string().min(1, "Current occupation is required"),
  educational_level_id: z.string().min(1, "Educational level is required"),
  educational_institute: z.string().min(1, "Educational institute is required"),
  graduation_year: z.coerce.number().min(1900, "Graduation year is required"),
  field_of_study_id: z.coerce.string().min(1, "Field of study is required"),
  is_have_team: z.enum(["Yes", "No"], {
    errorMap: () => ({ message: "Please specify if you have a team" }),
  }),
  comment: z.string().optional(),
  national_id_front: z.any(),
  national_id_back: z.any(),
  personal_photo: z.any(),
});

export type ParticipantFormValues = z.infer<typeof participantValidationSchema>;
