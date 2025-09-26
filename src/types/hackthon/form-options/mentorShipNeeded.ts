export type MentorShipNeeded = {
  id: string;
  title: string;
  extra_field: null | string;
  how_many_teams_need:string
};
export type MentorShipNeededResponse = {
  success: boolean;
  status: number;
  message: string;
  data: MentorShipNeeded[];
};
