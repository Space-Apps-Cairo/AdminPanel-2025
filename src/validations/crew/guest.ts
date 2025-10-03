import { z } from "zod"

export const guestValidationSchema = z.object({
  full_name: z.string().min(1, "Full Name is required"),
  organization: z.string().nullable().optional(),
  national: z.string().min(1, "National ID is required"),
  free_space: z.string().nullable().optional(),
})
