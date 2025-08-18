export interface Skill {
  id: number;
  name: string;
  type: string; // could also be union type: "Technical" | "Non-Technical"
}

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
  national_id_front: File | string; // URL
  national_id_back: File | string; // URL
  personal_photo: File | string; // URL
  skills: Skill[];
  created_by: CreatedBy;
};

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
export type ParticipantRequest = Omit<Participant, "id">;
export type ParticipantsResponse = ApiResponse<Participant[]>;
export type ParticipantResponse = ApiResponse<Participant>;
