export interface Team {
  id: number;
  team_name: string;
  status: string; 
  participation_method: string;
}
export interface TeamResponse {
  success: boolean;
  message: string;
  status: number;
  data: Team[];
}
