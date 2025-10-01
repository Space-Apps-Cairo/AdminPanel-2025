export interface RegisterHackathonMemberRequest {
  member_id: number | string;
}
export interface RegisterHackathonMemberResponse {
  status: number;
  success: boolean;
  message: string;
}
