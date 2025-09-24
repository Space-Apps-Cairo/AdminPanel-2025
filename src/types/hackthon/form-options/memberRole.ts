export interface MemberRole {
  id: number;
  name: string; // roleName
  [key: string]: unknown;
}

export interface MemberRolesResponse {
  data: MemberRole[];
}
