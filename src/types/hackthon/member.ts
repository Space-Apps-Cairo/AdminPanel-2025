// src/types/member.ts
export interface Member {
  id: number; // assuming each member has an ID
  national: string;
  name: string;
  email: string;
  phone_number: string;
  age: number;
  is_new: boolean;
  member_role: string; // extend as needed
  tshirt_size_id: number;
  tshirt_size: any;
  major_id: number;
  major: any;
  organization: string;
  participant_type: "online" | "offline" | "hybrid"; // extend as needed
  study_level_id: number;
  study_level: any;
  extra_field?: string;
  notes?: string;
  created_at: string;
  created_by_id: number;
}

// Generic API response
type ApiResponse<T> = {
  success: boolean;
  message: string;
  status: number;
  data: T;
  count?: number;
  total_pages?: number;
  current_page?: number;
  per_page?: string | number;
};

// Request type (omit auto-generated fields)
export type MemberRequest = Omit<Member, "id" | "created_at" | "created_by_id">;

export type MembersResponse = ApiResponse<Member[]>;
export type MemberResponse = ApiResponse<Member>;
