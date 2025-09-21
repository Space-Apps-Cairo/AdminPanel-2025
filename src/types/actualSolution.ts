export interface ActualSolution {
  id: number;
  title: string;
  description?: string;
  teamId: number;
}

export interface ActualSolutionsResponse {
  data: ActualSolution[];
}
