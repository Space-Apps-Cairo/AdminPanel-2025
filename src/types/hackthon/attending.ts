export interface RegisterHackathonMemberRequest {
  uuid: number | string;
}
export interface RegisterHackathonMemberResponse {
  status: number;
  success: boolean;
  message: string;
}
