export interface Nationality {
  id: number;
  name: string;
  [key: string]: any; // Add this line
}

// Based on your provided API response
export interface NationalitiesRes {
  status: number;
  success: boolean;
  message: string;
  data: Nationality[];
}

export interface SingleNationalityRes {
  status: number;
  success: boolean;
  message: string;
  data: Nationality;
}

export interface DeleteNationalityRes {
  status: number;
  success: boolean;
  message: string;
  data: null;
}

export type CreateNationalityRequest = Omit<Nationality, "id">;

export type ApiResponse<T> = {
  status: number;
  success: boolean;
  message: string;
  data: T;
};

export type TeamStatus = {
  id: number;
  name: string;
  key: string;
};

export type CreateTeamStatusRequest = {
  label: string;
  key: string;
};

export type ParticipationStatus = {
  id: number;
  name: string;
  key: string;
};

export type CreateParticipationStatusRequest = {
  label: string;
  key: string;
};
