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
    .length(9, { message: "National ID must be exactly 9 digits." }),
  team_id: z.number().int().positive({ message: "Team ID must be a positive number." }),
});

export type TeamMemberSchema = z.infer<typeof SpecialMemberSchema>;
