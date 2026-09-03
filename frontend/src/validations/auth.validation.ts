import { z } from "zod/v3";

export const loginSchema = z.object({

    email: z
    .string()
    .trim()
    .email("Invalid email address")
    .nonempty("Email is required.")
    .max(255, "Email must not exceed 255 characters"),

    password: z
    .string()
    .nonempty("Password is required.")
    .max(255, "Password must not exceed 255 characters"),

})

export type LoginSchemaFormValues = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .nonempty("Email is required.")
    .max(255, "Email must not exceed 255 characters"),
});

export type ForgotPasswordSchemaFormValues = z.infer<typeof forgotPasswordSchema>;


export const resetPasswordLinkSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must not exceed 255 characters"),
  token: z
    .string()
    .min(1, "Reset token is required")
    .max(255, "Reset token is invalid"),
});

export const resetPasswordSchema = resetPasswordLinkSchema
  .extend({
    password: z
      .string()
      .nonempty("Password is required.")
      .min(6, "Password must be at least 6 characters")
      .max(255, "Password must not exceed 255 characters"),
    password_confirmation: z
      .string()
      .nonempty("Password Confirmation is required!")
      .max(255, "Password confirmation must not exceed 255 characters"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

export type ResetPasswordSchemaFormValues = z.infer<typeof resetPasswordSchema>;
