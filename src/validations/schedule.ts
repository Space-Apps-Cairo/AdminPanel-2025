import z from "zod";

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

export const scheduleValidationSchema = z.object({
  date: z.coerce.date(),

  start_time: z
    .string()
    .min(1, "Start time is required")
    .refine((time) => {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(time);
    }, "Start time must be in HH:MM format (24-hour)"),

  end_time: z
    .string()
    .min(1, "End time is required")
    .refine((time) => {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(time);
    }, "End time must be in HH:MM format (24-hour)"),

  capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1")
    .max(1000, "Capacity cannot exceed 1000"),

  // available_slots: z.coerce
  //   .number()
  //   .min(0, "Available slots cannot be negative"),

  // available_slots_on_site: z.coerce
  //   .number()
  //   .min(0, "Available slots on site cannot be negative"),
});
//   .refine(
//     (data) => {
//       const [startHour, startMinute] = data.start_time.split(":").map(Number);
//       const [endHour, endMinute] = data.end_time.split(":").map(Number);

//       const startTotalMinutes = startHour * 60 + startMinute;
//       const endTotalMinutes = endHour * 60 + endMinute;

//       return endTotalMinutes > startTotalMinutes;
//     },
//     {
//       message: "End time must be after start time",
//       path: ["end_time"],
//     }
//   )
//   .refine(
//     (data) => {
//       return data.available_slots <= data.capacity;
//     },
//     {
//       message: "Available slots cannot exceed capacity",
//       path: ["available_slots"],
//     }
//   )
//   .refine(
//     (data) => {
//       return data.available_slots_on_site <= data.available_slots;
//     },
//     {
//       message: "Available slots on site cannot exceed total available slots",
//       path: ["available_slots_on_site"],
//     }
//   );

export type ScheduleValidation = z.infer<typeof scheduleValidationSchema>;

