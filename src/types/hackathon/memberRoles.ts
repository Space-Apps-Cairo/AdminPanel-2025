// src/types/hackathon/memberRoles.ts
export interface MemberRole {
  id: number;
  name: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MemberRoleRequest {
  name: string;
  description?: string | null;
}
