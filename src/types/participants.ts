// types/participants.ts

import type { Skill } from "./skill";

export interface CreatedBy {
  id: number;
  name: string;
  email: string;
}

export type Participant = {
  id: string;
  uuid: string;
  name_ar: string;
  name_en: string;
  email: string;
  age: number;
  phone_number: string;
  birth_date: string; // e.g. "2005-04-25"
  nationality: string; // e.g. "Egypt"
  governorate: string; // e.g. "Cairo"
  educational_institute: string;
  graduation_year: number | string;
  current_occupation: string;
  educational_level_id: number | string;
  field_of_study_id: number | string;
  national_id: string;
  is_have_team: "individual" | "team_not_complete" | "team_complete";
  participation_status: "ex_participant" | "ex_volunteer" | "first_time";
  participated_years: string | string[];
  attend_workshop: number | boolean;
  why_this_workshop: string;
  comment: string;
  year: number | string;
  national_id_front: File | string ;
  national_id_back: File | string ;
  personal_photo: File | string ;
  skills: Skill[];
  created_by: CreatedBy;
  first_priority_id?: number;
  second_priority_id?: number;
  third_priority_id?: number;
  created_at?: string;
};

// Request type for sending to API (FormData)
export type ParticipantRequest = Omit<
  Participant,
  "id" | "uuid" | "skills" | "created_by"> & {
  skills: string[]; // send skill IDs instead of full objects
};

// Form type (optional)
export type ParticipantFormValues = Partial<Participant>;
