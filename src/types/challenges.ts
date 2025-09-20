// ====== challenges-types ====== //

export type DifficultyLevel = {
	id: number;
	name: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

export type Challenge = {
	id: number;
	title: string;
	description: string;
	difficulty_level: DifficultyLevel;
}

export type ChallengesRes = {
	status: number;
	success: boolean;
	message: string;
	data: Challenge[];
}

export type SingleChallengeRes = {
	status: number;
	success: boolean;
	message: string;
	data: Challenge;
}

export type CreateChallengeRequest = {
	title: string;
	description: string;
	difficulty_level_id?: number;
}

export type CreateChallengeResponse = {
	status: number;
	success: boolean;
	message: string;
	data: {
		id: number;
		title: string;
		description: string;
	};
}

export type UpdateChallengeRequest = Partial<CreateChallengeRequest>;

export type UpdateChallengeResponse = {
	status: number;
	success: boolean;
	message: string;
	data: {
		id: number;
		title: string;
		description: string;
	};
}