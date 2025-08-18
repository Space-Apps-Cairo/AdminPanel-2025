<<<<<<< HEAD
// src/validations/participantSchema.ts
import { z } from "zod";

export const participantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, "Invalid Egyptian phone number"),
  status: z
    .string()
    .min(1, "Status is required")
    .refine((val) => ["active", "inactive"].includes(val), {
      message: "Invalid status",
    }),
=======
 // src/validations/participantSchema.ts
import { z } from "zod";

const genderEnum = z.enum(["male", "female"]);
const statusEnum = z.enum(["active", "inactive"]);

export const participantSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Phone is required"),
  gender: genderEnum.refine((v) => !!v, { message: "Gender is required" }),
  status: statusEnum.refine((v) => !!v, { message: "Status is required" }),
>>>>>>> 5b0490d00324e886d65979efd1577e3af36f4623
});

export type ParticipantFormValues = z.infer<typeof participantSchema>;
