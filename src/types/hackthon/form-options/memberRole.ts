
export interface MemberRole {
  id: number;
  title: string;
  extra_field?: string | null;
  description: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  created_by_id?: number | null;
  created_by?: unknown | null;
  [key: string]: unknown;
}

export interface MemberRolesResponse {
  data: MemberRole[];
}
