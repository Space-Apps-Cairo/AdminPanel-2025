export interface Major {
  id: number;
  title: string;
  extra_field?: string;
  description: string;
  created_at: string;
  created_by_id: number;
}

type ApiResponse<T> = {
  success: boolean;
  message: string;
  status: number;
  data: T;
};

export type MajorRequest = Omit<Major, "id" | "created_at" | "created_by_id">;

export type MajorsResponse = ApiResponse<Major[]>;
export type MajorResponse = ApiResponse<Major>;
