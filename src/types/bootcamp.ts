interface BootcampType {
  id: string | number;
  name: string;
  date: string;
  total_capacity: number;
  //   bootcamp_details_bootcamp_attendees?: ;
  forms: [];
}
export interface BootcampResponse {
  success: boolean;
  message: string;
  status: number;
  data: BootcampType[];
}
