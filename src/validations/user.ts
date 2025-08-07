 
import { z } from "zod";

export interface UserFormValues {
  name: string;
  email: string;
  status: "Active" | "Inactive";
  location: string;
  balance: string;
  password: string;
  terms: boolean;
}

 
export const userValidationSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  status: z.enum(["Active", "Inactive"]),
  location: z.string().min(2),
  balance: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Balance must be a number",
  }),
  password: z.string().min(6),
  terms: z.literal(true).or(
    z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    })
  ),
}) satisfies z.ZodType<UserFormValues>;
