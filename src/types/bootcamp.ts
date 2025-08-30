import { DataTableRow } from "@/types/table";

export interface BootcampType {
  id: string | number;
  name: string;
  date: string;
  total_capacity: number;
  //   bootcamp_details_bootcamp_attendees?: ;
  forms: [];
  [key: string]: unknown;
}

export interface BootcampResponse {
  success: boolean;
  message: string;
  status: number;
  data: BootcampType[];
}

export type BootcampRequest = Omit<BootcampType, "id">;

// Bootcamp Attendees Types
export interface BootcampAttendee extends DataTableRow {
  id: number;
  category: string;
  attendance_status: string;
  check_in_time: string;
  bootcamp_details: {
    id: number;
    name: string;
  };
  bootcamp_participant: {
    id: number;
    uuid: string;
    name_en: string;
    email: string;
    national_id: string;
  };
  created_by: {
    id: number | null;
    name: string | null;
  };
  created_at: string;
  updated_at: string;
}

export interface BootcampAttendeeRequest {
  bootcamp_details_id: number;
  bootcamp_participant_uuid: string;
  category: string;
  attendance_status: string;
}

export interface BootcampAttendeeResponse {
  data: BootcampAttendee;
}

// Add this new type for getting bootcamp attendees list
export interface BootcampAttendeesResponse {
  success: boolean;
  message: string;
  status: number;
  data: BootcampAttendee[];
}


