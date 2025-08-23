 import { Workshop , Schedule } from "./workshop";  
import {ParticipantResponse} from "./participants"

export type ParticipantPreference= {
  id: number;
  preference_order:number;
  participant:ParticipantResponse;
  workshop: Workshop | null;
}

export type PreferencesResponse ={
  success: boolean;
  status: number;
  message: string;
  data: ParticipantPreference[];
}
//Assignment tab
export type Assignment = {
  bootcamp_participant_id:any;
  id: number;
  attendance_status: string; 
  check_in_time: string;
  schedule: Schedule;
};