import { z } from "zod";

export const ParticipantPreferenceSchema = z.object({
  id: z.any().optional(),
  preference_order: z.any(),
  bootcamp_participant_id: z.any(),
  workshop_id: z.any(),
});



export type ParticipantPreferenceType = z.infer<
  typeof ParticipantPreferenceSchema
>;
