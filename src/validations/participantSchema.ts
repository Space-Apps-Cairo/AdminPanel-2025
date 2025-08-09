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
});

export type ParticipantFormValues = z.infer<typeof participantSchema>;
