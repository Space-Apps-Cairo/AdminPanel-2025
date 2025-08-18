
import { z } from "zod";
import {participantSchema } from "./participantSchema"; 
import { workshopValidationSchema } from "./workshop";    

export const ParticipantPreferenceSchema = z.object({
  id: z.number(),
  preference_order: z.coerce.number(), 
 bootcamp_participant_id:  z.coerce.number(), 
  workshop_id:  z.coerce.number().nullable(),
});


export type ParticipantPreferenceType = z.infer<typeof ParticipantPreferenceSchema>;
