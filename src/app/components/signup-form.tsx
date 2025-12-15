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

import { useRouter } from "next/navigation";
import { useSignupMutation } from "../../lib/api/authApi";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [signup, { isLoading, error }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password2: "",
      phone_number: "",
      is_agree: false as any, // schema will require true on submit
      profile_picture: undefined,
    },
    mode: "onSubmit",
  });

  const onInvalid = (errs: any) => {
    console.log("FORM INVALID ❌", errs);
  };

  const onSubmit = async (data: SignupFormValues) => {
    console.log("SUBMIT HIT ✅", data);

    try {
      const file = (data.profile_picture as FileList | undefined)?.[0];

      // ✅ Backend যদি file নেয়, safest is FormData (multipart/form-data)
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("password2", data.password2);
      formData.append("phone_number", data.phone_number);
      formData.append("is_agree", "true"); // literal true required

      if (file) {
        formData.append("profile_picture", file);
      } else {
        // backend যদি field চাই কিন্তু empty ok হয়, চাইলে এটা রাখতে পারো:
        // formData.append("profile_picture", "");
      }

      await signup(formData as any).unwrap();
      router.push("/login");
    } catch (err: any) {
      const apiData = err?.data;

      // generic msg
      if (apiData?.message) {
        setError("email", { type: "server", message: apiData.message });
      }

      // field-wise errors (backend যেভাবে দেয়)
      if (apiData?.email?.[0]) {
        setError("email", { type: "server", message: apiData.email[0] });
      }
      if (apiData?.password?.[0]) {
        setError("password", { type: "server", message: apiData.password[0] });
      }
      if (apiData?.phone_number?.[0]) {
        setError("phone_number", {
          type: "server",
          message: apiData.phone_number[0],
        });
      }

      console.log("Signup failed:", err);
    }
  };

  return (
    <form
      {...props}
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify((error as any)?.data ?? error, null, 2)}
            </pre>
          </div>
        )}

        {/* first_name + last_name */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="first_name" className="mb-2">
                First Name
              </FieldLabel>
              <Input
                id="first_name"
                type="text"
                placeholder="Enter your first name"
                {...register("first_name")}
              />
              {errors.first_name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </Field>
          </div>

          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="last_name" className="mb-2">
                Last Name
              </FieldLabel>
              <Input
                id="last_name"
                type="text"
                placeholder="Enter your last name"
                {...register("last_name")}
              />
              {errors.last_name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </Field>
          </div>
        </div>

        {/* email */}
        <Field>
          <FieldLabel htmlFor="email" className="mb-2">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email with
            anyone else.
          </FieldDescription>
        </Field>

        {/* password + password2 */}
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
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </Field>
          </div>

          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="password2" className="mb-2">
                Confirm Password
              </FieldLabel>
              <Input
                id="password2"
                type="password"
                placeholder="Enter confirm password"
                {...register("password2")}
              />
              {errors.password2 && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password2.message}
                </p>
              )}
            </Field>
          </div>
        </div>

        {/* phone_number */}
        <Field>
          <FieldLabel htmlFor="phone_number" className="mb-2">
            Phone Number
          </FieldLabel>
          <Input
            id="phone_number"
            type="tel"
            placeholder="Enter phone number (e.g. +1234567890)"
            {...register("phone_number")}
          />
          {errors.phone_number && (
            <p className="text-xs text-red-500 mt-1">
              {errors.phone_number.message}
            </p>
          )}
        </Field>

        {/* profile_picture */}
        <Field>
          <FieldLabel htmlFor="profile_picture" className="mb-2">
            Profile picture (Optional)
          </FieldLabel>
          <Input
            id="profile_picture"
            type="file"
            accept="image/*"
            {...register("profile_picture")}
          />
        </Field>

        {/* is_agree */}
        <Field>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" {...register("is_agree")} />
            <span>
              I agree to the{" "}
              <a href="#" className="underline underline-offset-4">
                terms and conditions
              </a>
              <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.is_agree && (
            <p className="text-xs text-red-500 mt-1">{errors.is_agree.message}</p>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? "Creating..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

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
