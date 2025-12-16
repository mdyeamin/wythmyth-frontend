"use client";

import { cn } from "../../lib/utils";
import { Button } from "./ui/button";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../../validations/loginSchema";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "./ui/field";
import { Input } from "./ui/input";
import Link from "next/link";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  useLoginMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
} from "../../lib/api/authApi";

import { useDispatch } from "react-redux";
import { setUser } from "../../lib/auth/authSlice"; // ✅ setCredentials না, setUser

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const needOtp = searchParams.get("needOtp") === "1";
  const emailFromQuery = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [otpMsg, setOtpMsg] = useState<string | null>(null);

  const [login, { isLoading, error }] = useLoginMutation();
  const [verifyEmail, { isLoading: verifyingOtp }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: resendingOtp }] = useResendOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: emailFromQuery,
      password: "",
    },
    mode: "onSubmit",
  });

  // query param থেকে email auto set
  useEffect(() => {
    if (emailFromQuery) setValue("email", emailFromQuery);
  }, [emailFromQuery, setValue]);

  const onInvalid = (errs: any) => {
    console.log("FORM INVALID ❌", errs);
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const payload = { email: data.email, password: data.password };
      const res = await login(payload).unwrap();

      // ✅ তোমার backend pattern: response.data.user
      const user = res?.data?.user ?? res?.user;

      if (user) {
        dispatch(setUser(user)); // ✅ redux user set
      }

      router.replace("/dashboard");
    } catch (err: any) {
      const apiData = err?.data;

      if (apiData?.detail) {
        setError("password", { type: "server", message: apiData.detail });
      } else if (apiData?.message) {
        setError("password", { type: "server", message: apiData.message });
      } else if (apiData?.non_field_errors?.[0]) {
        setError("password", {
          type: "server",
          message: apiData.non_field_errors[0],
        });
      } else if (apiData?.email?.[0]) {
        setError("email", { type: "server", message: apiData.email[0] });
      } else if (apiData?.password?.[0]) {
        setError("password", { type: "server", message: apiData.password[0] });
      }

      console.log("Login failed:", err);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpMsg(null);
    const email = emailFromQuery || watch("email");

    if (!email) return setOtpMsg("Email is missing.");
    if (!otp || otp.length < 4) return setOtpMsg("Please enter a valid OTP.");

    try {
      await verifyEmail({ email, otp }).unwrap();
      setOtpMsg("✅ OTP verified. Now you can login.");
      router.replace(`/login?email=${encodeURIComponent(email)}`);
 // needOtp remove
    } catch (err: any) {
      setOtpMsg(err?.data?.message || "❌ OTP invalid or expired.");
    }
  };

  const handleResendOtp = async () => {
    setOtpMsg(null);
    const email = emailFromQuery || watch("email");
    if (!email) return setOtpMsg("Email is missing.");

    try {
      await resendOtp({ email }).unwrap();
      setOtpMsg("✅ OTP sent again. Check your email.");
    } catch (err: any) {
      setOtpMsg(err?.data?.message || "❌ Failed to resend OTP.");
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      {...props}
      noValidate
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {/* ✅ OTP box */}
        {needOtp && (
          <div className="rounded-md border p-4 space-y-3">
            <p className="text-sm">
              We sent an OTP to <b>{emailFromQuery || watch("email")}</b>. Verify
              to login.
            </p>

            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <Button
              type="button"
              className="w-full"
              onClick={handleVerifyOtp}
              disabled={verifyingOtp}
            >
              {verifyingOtp ? "Verifying..." : "Verify OTP"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendOtp}
              disabled={resendingOtp}
            >
              {resendingOtp ? "Sending..." : "Resend OTP"}
            </Button>

            {otpMsg && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {otpMsg}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify((error as any)?.data ?? error, null, 2)}
            </pre>
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email" className="mb-2">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
            disabled={!!emailFromQuery}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="mb-2">
              Password
            </FieldLabel>
            <Link
              href="/forgot-password"
              className="mb-2 ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </Field>

        <Field>
          <Button
            type="submit"
            disabled={needOtp || isSubmitting || isLoading}
            className="w-full"
            title={needOtp ? "Verify OTP first" : undefined}
          >
            {isSubmitting || isLoading ? "Logging in..." : "Login"}
          </Button>

          {needOtp && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              🔒 Verify OTP first to enable login.
            </p>
          )}
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" className="flex items-center gap-2">
            <FaGithub className="h-5 w-5" />
            Login with GitHub
          </Button>

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}