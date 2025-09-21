export type StudyLevel={
     id: string;
  title: string;
  extra_field: string | null;
  description: string;
  created_at: string;
  update_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by_id: string;
}
export type StudyLevelResponse={
 success: boolean;
  message: string;
  status: number;
  data:StudyLevel[];
}