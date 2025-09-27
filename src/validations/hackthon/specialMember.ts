import z from "zod";

export const SpecialMemberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z
    .string()
    .min(10, { message: "Phone must be at least 10 digits." })
    .max(15, { message: "Phone must not exceed 15 digits." }),
  reason: z.string().min(5, { message: "Reason must be at least 5 characters." }),
  national_id: z
    .string()
    .length(14, { message: "National ID must be exactly 14 digits." }),
  team_id: z.string().min(2,{ message: "Team ID must be at least 2 characters" }),
   national_id_front: z.any().nullable(),
  national_id_back: z.any().nullable(),
});

export type TeamMemberSchema = z.infer<typeof SpecialMemberSchema>;
