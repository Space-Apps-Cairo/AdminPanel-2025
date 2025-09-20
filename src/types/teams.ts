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
}

export type Challenge = {
	id: number;
	title: string;
	description: string;
}

export type ParticipationMethod = {
	id: number;
	title: string;
	extra_field: string | null;
}

export type MentorshipNeeded = {
	id: number;
	title: string;
	extra_field: string;
}

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
	team_leader: TeamLeader | null;
	challenge: Challenge | null;
	actual_solution: string | null;
	mentorship_needed: MentorshipNeeded | null;
	participation_method: ParticipationMethod;
	created_at: string;
}

export type TeamsRes = {
	status: number;
	success: boolean;
	message: string;
	data: Team[];
}

export type SingleTeamRes = {
	status: number;
	success: boolean;
	message: string;
	data: Team;
}

export type CreateTeamRequest = Omit<Team, 'id' | 'uuid' | 'created_at' | 'team_leader' | 'challenge' | 'mentorship_needed' | 'participation_method'>;

export type UpdateTeamRequest = Partial<CreateTeamRequest>;
