import { z } from "zod"

export const guestValidationSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  organization: z.string().nullable().optional(),
  nationality: z.string().min(1, "National ID is required"),
  freeSpace: z.string().nullable().optional(),
})
