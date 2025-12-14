// src/validations/signupSchema.ts
import { z } from "zod";

export const signupSchema = z
  .object({
    //  backend: first_name (max 150)
    first_name: z
      .string()
      .min(1, "First name is required")
      .max(150, "First name can't be more than 150 characters"),

    //  backend: last_name (max 150)
    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(150, "Last name can't be more than 150 characters"),

    //  backend: email (max 254)
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .max(254, "Email can't be more than 254 characters"),

    //  backend: password (max 128) + strong password rules
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password can't be more than 128 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

    //  backend: password2 (confirm password)
    password2: z.string().min(1, "Please confirm your password"),

    //  backend: phone_number (required) pattern: ^\+?\d{10,15}$
    phone_number: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\+?\d{10,15}$/, "Phone number must be 10–15 digits, optionally starting with +"),

    //  backend: profile_picture (uri, nullable, optional)
    // frontend e file upload thakle: File | undefined | null handle koro
    profile_picture: z
      .any()
      .optional()
      .nullable(),

    //  backend: is_agree (must be true)
    is_agree: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms and conditions" }),
    }),
  })
  //  password === password2 match
  .refine((data) => data.password === data.password2, {
    path: ["password2"],
    message: "Passwords do not match",
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
