export type Mentor = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone_number: string;
  jobTitle: string; // GET returns 'jobTitle'
  organization: string;
  brief_professional_bio: string;
  area_of_expertise: string;
  level_of_experience: string;
  tshirt_size: string;
  additional_comments: string;
  was_part_of_nasa_space_apps: number | boolean; // GET may be 0/1
  available_for_full_support: number | boolean;
  available_during_hackathon_all_times: number | boolean;
  willing_to_stay_overnight: number | boolean;
  linkedin_profile_url: string;
  personal_photo_path: string;
  national_id_front_path: string;
  national_id_back_path: string;
  space_apps_year: string;
  timing_concerns: string;
};

export type MentorsRes = {
  status: number;
  success: boolean;
  message: string;
  data: Mentor[];
  count?: number;
  total_pages?: number;
  current_page?: number;
  per_page?: number | string;
};

export type CreateMentorRequest = {
  name: string;
  email: string;
  phone_number: string;
  job_title: string; // POST expects 'job_title'
  organization: string;
  brief_professional_bio?: string;
  area_of_expertise?: string;
  level_of_experience?: string;
  was_part_of_nasa_space_apps?: boolean;
  available_for_full_support?: boolean;
  available_during_hackathon_all_times?: boolean;
  willing_to_stay_overnight?: boolean;
  tshirt_size?: string;
  linkedin_profile_url?: string;
  personal_photo_path?: string;
  national_id_front_path?: string;
  national_id_back_path?: string;
  space_apps_year?: string;
  timing_concerns?: string;
  additional_comments?: string;
};

export type ImportMentorsRequest = {
  mentors: CreateMentorRequest[];
};

export type ImportMentorsResponse = {
  status: number;
  success: boolean;
  message: string;
  data?: { mentors?: Mentor[] };
};