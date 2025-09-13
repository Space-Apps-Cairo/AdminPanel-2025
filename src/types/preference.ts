 import { Workshop , Schedule } from "./workshop";  
import {Participant} from "./participants"

export type ParticipantPreference = {
  id: number;
  preference_order:string;
  participant: Participant;
  workshop: Workshop | null;
};

export type PreferencesResponse = {
  success: boolean;
  status: number;
  message: string;
  data: ParticipantPreference[];
};


export type ParticipantPreferenceRequest = {
  bootcamp_participant_id: string; 
  workshop_id: string;             
  preference_order: string;        
};
//Assignment tab
export type Assignment = {
  bootcamp_participant_id:any;
  id: number;
  attendance_status: string; 
  check_in_time: string;
  schedule: Schedule;
};