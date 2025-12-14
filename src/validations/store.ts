// src/validations/signupSchema.ts
import { z } from "zod";

export const signupSchema = z
    .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

        confirmPassword: z.string().min(1, "Please confirm your password"),
        phone: z
            .string()
            .optional()
            .or(z.literal("")), // allow empty string
        avatar: z.any().optional(), // এখন আপাতত শুধু optional
        terms: z.literal(true, {
            errorMap: () => ({
                message: "You must accept the terms and conditions",
            }),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export type SignupFormValues = z.infer<typeof signupSchema>;
