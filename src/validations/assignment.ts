import { z } from "zod";

export const AssignmentSchema = z.object({
  workshop_schedule_id: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Schedule is required")
  ),
  attendance_status: z.string().nonempty("Attendance status is required"),
  check_in_time: z.string().nonempty("Check-in time is required"),
});
