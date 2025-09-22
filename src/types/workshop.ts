export type Schedule = {
  workshop_title: string;
  workshop_id?: number;
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  available_slots: number;
  available_slots_on_site: number;
};

export type Workshop = {
  id: number | string;
  title: string;
  name: string;
  description: string; // This will contain the HTML format from server
  start_date: string;
  end_date: string;
  workshop_details: string;
  created_at: string;

  schedules: Schedule[];
};

export type WorkshopsRes = {
  success: boolean;
  message: string;
  status: number;
  data: Workshop[];
};

export type SchedulesRes = {
  success: boolean;
  message: string;
  status: number;
  data: Schedule[];
};

export type ScheduleRes = {
  success: boolean;
  message: string;
  status: number;
  data: Schedule;
};

export type WorkshopRes = {
  success: boolean;
  message: string;
  status: number;
  data: Workshop;
};

export type PriorityParticipant = {
  id: string;
  name_en: string;
  name_ar: string;
  email: string;
};

//Dashboard data
export type WorkshopAttendance = {
  workshop_id: number | string;
  workshop_title: string | null;
  assigned_count: number;
  attended_count: number;
  absent_count: number;
};

export type WorkshopAttendanceResponse = {
  status: number;
  success: boolean;
  message: string;
  data: {
    attendance: WorkshopAttendance[];
  };
};
export type AttendeesData = {
  registered_attendees: number;
  enrolled_attendees: number;
  not_enrolled_attendees: number;
};

export type AttendeesResponse = {
  status: number;
  success: boolean;
  message: string;
  data: AttendeesData;
};

export type WorkshopCheckInRequest = {
  bootcamp_participant_uuid: string;
};

export type WorkshopCheckInResponse = {
  status: number;
  success: boolean;
  message: string;
  data: {
    id: number;
    attendance_status: string;
    check_in_time: string;
    schedule: {
      id: number;
      date: string;
      workshop_title: string;
      workshop_description: string;
      workshop_start_date: string;
      workshop_end_date: string;
    };
  };
};

export type WorkshopAttendee = {
  id: number;
  attendance_status: string;
  check_in_time: string;
  participant: {
    id: number;
    name: string;
  };
};

export type WorkshopAttendeesResponse = {
  success: boolean;
  status: number;
  message: string;
  data: WorkshopAttendee[];
};