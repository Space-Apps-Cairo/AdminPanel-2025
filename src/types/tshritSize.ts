export type TShirtSize = {
  id: string;
  title: string;
  extra_field: string | null;
  description: string;
  created_at: string;
  update_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by_id: number;
};
export type TShirtSizesResponse = {
  success: boolean;
  message: string;
  status: number;
  data: TShirtSize[];
};
