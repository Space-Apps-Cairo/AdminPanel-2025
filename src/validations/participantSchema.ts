import { z } from "zod";

// Regex & helpers
const egyptPhoneRegex = /^01[0-2,5][0-9]{8}$/; // موبایل مصري
const egyptNIDRegex = /^\d{14}$/;              // رقم قومي 14 رقم
const dateYMDRegex = /^\d{4}-\d{2}-\d{2}$/;    // YYYY-MM-DD

export const participantValidationSchema = z.object({
  
  name_ar: z.string().min(1, "Arabic name is required"),
  name_en: z.string().min(1, "English name is required"),
  email: z.string().email("Invalid email"),
  phone_number: z
    .string()
    .regex(egyptPhoneRegex, "Invalid Egyptian phone number (e.g. 01XXXXXXXXX)"),
  national_id: z.preprocess(
    (v) => (v == null ? undefined : String(v).trim()),
    z
      .string()
      .regex(egyptNIDRegex, "National ID must be 14 digits")
  ),
  nationality: z.string().min(1, "Nationality is required"),

  // -------- Step 2 --------
  birth_date: z
    .string()
    .regex(dateYMDRegex, "Birth date must be in YYYY-MM-DD format"),
  age: z.coerce.number().int().min(0, "Age must be a positive number").optional(),
  governorate: z.string().min(1, "Governorate is required"),
  current_occupation: z.string().optional(),
  educational_level_id: z.coerce
    .number({
      invalid_type_error: "Educational level is required",
    })
    .int("Educational level must be a valid ID"),
  educational_institute: z.string().min(1, "Educational institute is required"),

  
  graduation_year: z
    .coerce
    .number()
    .int("Graduation year must be an integer")
    .min(1900, "Graduation year seems too old")
    .max(new Date().getFullYear() + 10, "Graduation year seems too far")
    .optional(),

  field_of_study_id: z.coerce
    .number({
      invalid_type_error: "Field of study is required",
    })
    .int("Field of study must be a valid ID"),

  skills: z
    .array(z.union([z.string(), z.number()]))
    .transform((arr) => arr.map((v) => Number(v)))
    .optional(),

  is_have_team: z
    .string()
    .transform((v) => v.trim())
    .refine((v) => v === "Yes" || v === "No", {
      message: "Has Team must be either Yes or No",
    }),

  participation_status: z
    .enum(["ex_participant", "ex_volunteer", "first_time"])
    .optional(),

  participated_years: z.coerce.number().int().optional(),

  attend_workshop: z
    .coerce
    .number()
    .int()
    .refine((v) => v === 0 || v === 1, {
      message: "Attend Workshop must be 0 or 1",
    })
    .optional(),

  why_this_workshop: z.string().optional(),
  year: z.coerce.number().int().optional(),
  comment: z.string().optional(),

  
  national_id_front: z.any().optional(),
  national_id_back: z.any().optional(),
  personal_photo: z.any().optional(),
});

export type ParticipantValidationInput = z.infer<typeof participantValidationSchema>;
export type ParticipantFormValues = z.infer<typeof participantValidationSchema>;
