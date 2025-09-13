import { z } from "zod";

export const ParticipantPreferenceSchema = z.object({
  id: z.string().optional(),
  preference_order: z
    .preprocess((val) => {
      if (typeof val === "string" && val.trim() !== "") {
        return Number(val);
      }
      return val;
    }, z.number().int().positive("Preference order must be a positive number"))
    .transform((val) => String(val)),

  workshop_id: z.string().min(1, "Workshop ID is required"),
});

export type ParticipantPreferenceType = z.infer<
  typeof ParticipantPreferenceSchema
>;
