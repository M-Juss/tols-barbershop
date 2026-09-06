import { z } from "zod";

export const accountInformationSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(255, "Full name must be less than 255 characters")
    .regex(/^[A-Za-z\s]+$/, "Full name must only contain letters and spaces"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),
  contact_number: z
    .string()
    .refine(
      (value) => value === "" || /^09\d{9}$/.test(value),
      "Contact number must be a valid PH mobile number (09XXXXXXXXX)",
    )
    .max(11, "Contact number must not exceed 11 digits"),
  current_password: z.string().max(255).optional(),
});

export type AccountInformationSchemaFormValues = z.infer<
  typeof accountInformationSchema
>;

export const changePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, "Current password is required")
      .max(255, "Current password must not exceed 255 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(255, "Password must be less than 255 characters"),
    password_confirmation: z
      .string()
      .min(1, "Confirm password is required")
      .max(255, "Password confirmation must not exceed 255 characters"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type ChangePasswordSchemaFormValues = z.infer<typeof changePasswordSchema>;
