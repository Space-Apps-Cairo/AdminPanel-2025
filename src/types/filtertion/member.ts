import { Team } from "./team";

export interface Member {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  teams: Team[]; 
}
export interface MembersResponse {
  status: number;
  success: boolean;
  data: Member[];
}
