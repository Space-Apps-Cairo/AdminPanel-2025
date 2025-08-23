import z from "zod";

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

export const scheduleValidationSchema = z.object({
  date: z.coerce.date(),

  start_time: z
    .string()
    .min(1, "Start time is required")
    .refine((time) => timeRegex.test(time), "Start time must be in HH:MM:SS format (24-hour)"),
  
  end_time: z
    .string()
    .min(1, "End time is required")
    .refine((time) => timeRegex.test(time), "End time must be in HH:MM:SS format (24-hour)"),
  
  capacity: z.coerce.number()
    .min(1, "Capacity must be at least 1")
    .max(10000, "Capacity cannot exceed 10000"),
  
  // available_slots: z.coerce.number()
  //   .min(0, "Available slots cannot be negative"),
  
  // available_slots_on_site: z.coerce.number()
  //   .min(0, "Available slots on site cannot be negative")
})
.refine((data) => {
  const [startHour, startMinute, startSecond] = data.start_time.split(':').map(Number);
  const [endHour, endMinute, endSecond] = data.end_time.split(':').map(Number);
  
  const startTotalSeconds = startHour * 3600 + startMinute * 60 + startSecond;
  const endTotalSeconds = endHour * 3600 + endMinute * 60 + endSecond;
  
  return endTotalSeconds > startTotalSeconds;
}, {
  message: "End time must be after start time",
  path: ["end_time"]
});

export type ScheduleValidation = z.infer<typeof scheduleValidationSchema>;
