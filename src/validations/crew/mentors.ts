import { z } from "zod";

export const mentorValidationSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Invalid email"),
  phone_number: z.string().min(5).max(30),
  job_title: z.string().min(1, "Job title is required"),
  organization: z.string().min(1, "Organization is required"),
  brief_professional_bio: z.string().optional(),
  area_of_expertise: z.string().optional(),
  level_of_experience: z.string().optional(),
  tshirt_size: z.string().optional(),
  additional_comments: z.string().optional(),
  was_part_of_nasa_space_apps: z.coerce.boolean().optional(),
  available_for_full_support: z.coerce.boolean().optional(),
  available_during_hackathon_all_times: z.coerce.boolean().optional(),
  willing_to_stay_overnight: z.coerce.boolean().optional(),
  linkedin_profile_url: z.string().url().optional(),
  personal_photo_path: z.string().optional(),
  national_id_front_path: z.string().optional(),
  national_id_back_path: z.string().optional(),
  space_apps_year: z.string().optional(),
  timing_concerns: z.string().optional(),
});