export interface ActualSolution {
  id: number;
  title: string;
  description: string;
  teamId: number;
  [key: string]: unknown;
}

export interface ActualSolutionsResponse {
  data: ActualSolution[];
}
