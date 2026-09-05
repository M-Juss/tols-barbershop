import { z } from "zod";

export const bookingScheduleSchema = z
  .object({
    open_day_from: z.number().int().min(1).max(7),
    open_day_to: z.number().int().min(1).max(7),
    closed_weekday: z.number().int().min(1).max(7).nullable(),
    opening_time: z.string().regex(/^(?:[01]\d|2[0-3]):00$/),
    closing_time: z.string().regex(/^(?:[01]\d|2[0-3]):00$/),
    custom_open_time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
    booking_days_ahead: z.number().int().min(1).max(30),
  })
  .superRefine((schedule, context) => {
    if (schedule.open_day_to < schedule.open_day_from) {
      context.addIssue({
        code: "custom",
        path: ["open_day_to"],
        message: "The last open day cannot come before the first open day.",
      });
    }
    if (schedule.closing_time < schedule.opening_time) {
      context.addIssue({
        code: "custom",
        path: ["closing_time"],
        message: "The closing time cannot be earlier than the opening time.",
      });
    }
    if (
      schedule.custom_open_time < schedule.opening_time
      || schedule.custom_open_time > schedule.closing_time
    ) {
      context.addIssue({
        code: "custom",
        path: ["custom_open_time"],
        message: "The custom time must be within the working hours.",
      });
    }
    if (
      schedule.closed_weekday !== null
      && (
        schedule.closed_weekday < schedule.open_day_from
        || schedule.closed_weekday > schedule.open_day_to
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["closed_weekday"],
        message: "The closed day must be within the open-day range.",
      });
    }
  });

export const scheduleOpenSlotSchema = z.object({
  slot_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  barber_user_ids: z.array(z.number().int().positive()).min(1),
  hour: z.number().int().min(1).max(12),
  minute: z.number().int().min(0).max(59),
  period: z.enum(["AM", "PM"]),
});
