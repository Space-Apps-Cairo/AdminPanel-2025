export type Guest = {
  id: number
  full_name: string
  organization?: string | null
  national: string
  free_space?: string | null
}

export type GuestRequest ={
  full_name: string;
  organization?: string | null;
  national: string;
  free_space?: string | null;
}

export type GuestResponse ={
   status: number;
    success: boolean;
    data: Guest[];
}
