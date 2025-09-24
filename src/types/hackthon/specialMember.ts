import { Team } from "../teams";

export interface Member {
  name: string;
  email: string;
  phone: string;
  reason: string;
  national_id: string;
  team_id: Team | number;
}