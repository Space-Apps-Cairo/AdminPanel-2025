import z from "zod";

export const userValidationSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be at most 50 characters"),
    email: z.string().email("Enter a valid Email"),
    password: z.string().min(10, "Password must be at least 10 characters"),
    gender: z.string(),
    dob: z.string(),
    terms: z.boolean(),
    file: z.any()
})