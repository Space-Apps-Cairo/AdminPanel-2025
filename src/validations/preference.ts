import { z } from "zod";
import { participantSchema } from "./participantSchema";
import { workshopValidationSchema } from "./workshop";

export const ParticipantPreferenceSchema = z.object({
  // id: z.number().optional(),
  preference_order: z.string(),
  bootcamp_participant_id: z.any(),
  workshop_id: z.string(),
});

export type ParticipantPreferenceType = z.infer<
  typeof ParticipantPreferenceSchema
>;
