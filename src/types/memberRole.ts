export interface MemberRole {
  id: number;
  name: string; // roleName
}

export interface MemberRolesResponse {
  data: MemberRole[];
}
