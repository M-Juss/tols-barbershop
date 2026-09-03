import { z } from "zod";

export const addOnSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Add-on name is required")
    .max(255, "Add-on name must be less than 255 characters")
    .regex(
      /^[A-Za-z0-9\s&'().+\-]+$/,
      "Add-on name contains unsupported characters",
    ),
  price: z
    .number()
    .int("Price must be a whole number")
    .min(0, "Price must be at least 0")
    .max(999999, "Price must not exceed 999999"),
  is_active: z.boolean(),
});

export type AddOnSchemaFormValues = z.infer<typeof addOnSchema>;
