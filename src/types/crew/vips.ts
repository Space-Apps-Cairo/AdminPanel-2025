import { DataTableRow } from "@/types/table";

export type Vip = DataTableRow & {
  id: number;
  uuid: string;
  name: string;
  organization: string;
  role: string;
};

export type VipsRes = {
  status: number;
  success: boolean;
  message: string;
  data: Vip[];
  count?: number;
  total_pages?: number;
  current_page?: number;
  per_page?: number | string;
};

export type CreateVipRequest = {
  name: string;
  organization: string;
  role: string;
};

export type ImportVipsRequest = {
  vips: CreateVipRequest[];
};

export type ImportVipsResponse = {
  status: number;
  success: boolean;
  message: string;
  data?: {
    vips?: Vip[];
  };
};