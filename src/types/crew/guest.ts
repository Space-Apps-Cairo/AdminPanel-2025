export type Guest = {
  id: number
  fullName: string
  organization?: string | null
  nationality: string
  freeSpace?: string | null
}

export type GuestRequest ={
  fullName: string;
  organization?: string | null;
  nationality: string;
  freeSpace?: string | null;
}

export type GuestResponse ={
   status: number;
    success: boolean;
    data: Guest[];
}
