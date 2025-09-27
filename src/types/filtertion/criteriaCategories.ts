// ====== criteria-categories-types ====== //

export type Criterion = {
	id: number;
	name: string;
	rating_type: "number" | "check";
	max_score: number;
	criteria_category_id: number;
}

export type CriteriaCategory = {
	id: number;
	name: string;
	description: string;
	percentage: number;
	criteria: Criterion[];
}

export type CriteriaCategoriesRes = {
	success: boolean;
	status: number;
	message: string;
	data: CriteriaCategory[];
}

export type SingleCriteriaCategoryRes = {
	success: boolean;
	status: number;
	message: string;
	data: CriteriaCategory;
}

export type CreateCriteriaCategoryRequest = {
	name: string;
	description: string;
	percentage: number;
	criteria: {
		name: string;
		rating_type: "number" | "check";
		max_score: number;
	}[];
}

export type CreateCriteriaCategoryResponse = {
	success: boolean;
	status: number;
	message: string;
	data: CriteriaCategory;
}

export type UpdateCriteriaCategoryRequest = Partial<CreateCriteriaCategoryRequest>;

export type UpdateCriteriaCategoryResponse = {
	success: boolean;
	status: number;
	message: string;
	data: CriteriaCategory;
}

export type CriteriaRatingRequest = {
	team_id: number;
	rate: {
		criteria_id: number;
		score: number;
	}[];
}

export type CriteriaRatingResponse = {
	success: boolean;
	status: number;
	message: string;
	data?: any;
}
