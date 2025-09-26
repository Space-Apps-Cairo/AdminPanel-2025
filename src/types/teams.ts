// import { DataTableRow } from "@/types/table";

// ====== teams-types ====== //

export type TeamLeader = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone_number: string;
  age: string;
  is_new: boolean;
  organization: string;
  participant_type: string;
  member_role: string;
  extra_field: string | null;
  notes: string | null;
  national: string;
  created_at: string;
};

export type TeamMember = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone_number: string;
  age: number;
  organization: string;
  national: string;
  is_new: boolean;
  member_role: "team_lead" | "member";
  participation_type: string | null;
  extra_field: string | null;
  notes: string | null;
};

export type Challenge = {
  id: number;
  title: string;
  description: string;
};

export type ParticipationMethod = {
  id: number;
  title: string;
  extra_field: string | null;
};

export type MentorshipNeeded = {
  id: number;
  title: string;
  extra_field: string;
};

export type TeamPhoto = {
  url: string;
  original_url: string;
  alt?: string;
};

export type Team = {
  id: number;
  uuid: string;
  team_name: string;
  limited_capacity: boolean;
  members_participated_before: boolean;
  project_proposal_url: string;
  project_video_url: string;
  team_rating: number | null;
  total_score: number | null;
  status: string | null;
  submission_date: string | null;
  extra_field: string | null;
  comment: string | null;
  nots: string | null;
  description: string | null;
  actual_solution: string | null;
  team_leader: TeamLeader | null;
  challenge: Challenge | null;
  mentorship_needed: MentorshipNeeded | null;
  participation_method: ParticipationMethod;
  members: TeamMember[];
  members_count: number;
  team_photo: TeamPhoto | null;
  created_at: string;
};

export type TeamsRes = {
  status: number;
  success: boolean;
  message: string;
  data: Team[];
  count?: number;
  total_pages?: number;
  current_page?: number;
  per_page?: string | number;
};
export type SingleTeamRes = {
  status: number;
  success: boolean;
  message: string;
  data: Team;
};

export type CreateTeamRequest = Omit<
  Team,
  | "id"
  | "uuid"
  | "created_at"
  | "team_leader"
  | "challenge"
  | "mentorship_needed"
  | "participation_method"
  | "members"
  | "members_count"
  | "team_photo"
>;

export type UpdateTeamRequest = Partial<CreateTeamRequest>;

// Add parameters type for teams query
export type TeamsQueryParams = {
  search?: string;
  limit?: number;
  page?: number;
};
