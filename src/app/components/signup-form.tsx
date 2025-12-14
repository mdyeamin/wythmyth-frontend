"use client";
import { cn } from "../../lib/utils";
import { Button } from "../components/ui/button";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormValues } from "../../validations/signupSchema";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../components/ui/field";
import { Input } from "../components/ui/input";
import Link from "next/link";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      terms: false,
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    console.log("Signup form data", data);
    // ekhane API call / mutation korbe
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        {/* Title */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>

        {/* Row 1: First Name + Last Name */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="firstName" className="mb-2">
                First Name
              </FieldLabel>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                required
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </Field>
          </div>
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="lastName" className="mb-2">
                Last Name
              </FieldLabel>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                required
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </Field>
          </div>
        </div>

        {/* Row 2: Email */}
        <Field>
          <FieldLabel htmlFor="email" className="mb-2">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>

        {/* Row 3: Password + Confirm Password */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="password" className="mb-2">
                Password
              </FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
              <FieldDescription>
                {/* Must be at least 8 characters long. */}
              </FieldDescription>
            </Field>
          </div>
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="confirmPassword" className="mb-2">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Enter confirm password"
                required
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
              <FieldDescription>
                {/* Please confirm your password. */}
              </FieldDescription>
            </Field>
          </div>
        </div>

        {/* Row 4: Phone Number */}
        <Field>
          <FieldLabel htmlFor="phone" className="mb-2">
            Phone Number
          </FieldLabel>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter phone number (e.g. +1234567890)"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </Field>

        {/* Row 5: Personal Image (Optional) */}
        <Field>
          <FieldLabel htmlFor="avatar" className="mb-2">
            Personal image (Optional)
          </FieldLabel>
          <Input id="avatar" type="file" {...register("avatar")} />
        </Field>

        {/* Row 6: Terms & Conditions checkbox */}
        <Field>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              required
              {...register("terms")}
            />
            <span>
              I agree to the{" "}
              <a href="#" className="underline underline-offset-4">
                terms and conditions
              </a>
              <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.terms && (
            <p className="text-xs text-red-500 mt-1">{errors.terms.message}</p>
          )}
        </Field>

        {/* Create Account button */}
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </Button>
        </Field>

        {/* OR continue with */}
        <FieldSeparator>Or continue with</FieldSeparator>

        {/* GitHub button + bottom text */}
        <Field>
          <Button
            variant="outline"
            type="button"
            className="flex items-center gap-2"
          >
            <FaGithub className="h-5 w-5" />
            Sign up with GitHub
          </Button>

          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
