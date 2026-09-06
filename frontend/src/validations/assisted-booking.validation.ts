import { z } from "zod";

const bookingDateSchema = z
  .string()
  .min(1, "Booking date is required.")
  .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), {
    message: "Booking date must be valid.",
  });

export const assistedBookingSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, "Customer name is required.")
    .max(255, "Customer name must not exceed 255 characters.")
    .regex(/^[\p{L}\s.'-]+$/u, "Enter a valid customer name."),
  customer_email: z
    .string()
    .trim()
    .max(255, "Email must not exceed 255 characters.")
    .refine((value) => value === "" || z.email().safeParse(value).success, {
      message: "Enter a valid email address.",
    }),
  customer_contact_number: z
    .string()
    .trim()
    .refine((value) => value === "" || /^09\d{9}$/.test(value), {
      message: "Enter a valid PH mobile number.",
    }),
  service_id: z.number().int().positive("Please select a service."),
  barber_user_id: z.number().int().positive("Please select a barber."),
  appointment_date: bookingDateSchema,
  appointment_time: z
    .string()
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Please select a booking time."),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must not exceed 500 characters.")
    .nullable()
    .optional(),
});

export type AssistedBookingValues = z.infer<typeof assistedBookingSchema>;
