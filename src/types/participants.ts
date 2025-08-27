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
  graduation_year: string; // could be number if always numeric
  current_occupation: string;
  educational_level_id: string;
  field_of_study_id: string;
  national_id: string;
  is_have_team: string; // e.g. "individual"
  participation_status: string; // e.g. "ex_participant"
  participated_years: string; // could also be string[] if multiple years
  attend_workshop: number; // 0 | 1 maybe? could also be boolean if API allows
  why_this_workshop: string;
  comment: string;
  year: string;
  national_id_front: File | string; // file or URL
  national_id_back: File | string;  // file or URL
  personal_photo: File | string;    // file or URL
  skills: Skill[];
  created_by: CreatedBy;
};

// Request type for sending to API (FormData)
export type ParticipantRequest = Omit<
  Participant,
  "id" | "uuid" | "skills" | "created_by"
> & {
  skills: string[]; // send skill IDs instead of full objects
};

// Form type (optional)
export type ParticipantFormValues = Partial<Participant>;
