export type ParticipationMethod = {
  id: string;
  title: string;
  extra_field: null | string;
};
export type ParticipationMethodResponse = {
  success: boolean;
  status: number;
  message: string;
  data: ParticipationMethod[];
};
