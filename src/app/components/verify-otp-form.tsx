"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useVerifyEmailMutation, useResendOtpMutation } from "../../lib/api/authApi";

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const [verifyEmail, { isLoading: verifying }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: resending }] = useResendOtpMutation();

  const onVerify = async () => {
    setMsg(null);
    try {
      await verifyEmail({ email, otp }).unwrap();
      router.replace(`/login?email=${encodeURIComponent(email)}`);
    } catch (e: any) {
      setMsg(e?.data?.message || "OTP invalid/expired");
    }
  };

  const onResend = async () => {
    setMsg(null);
    try {
      await resendOtp({ email }).unwrap();
      setMsg("OTP resent. Check email.");
    } catch (e: any) {
      setMsg(e?.data?.message || "Resend failed");
    }
  };

  return (
    <div className="space-y-3 rounded-md border p-4">
      <p className="text-sm">Enter OTP sent to: <b>{email}</b></p>

      <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />

      <Button className="w-full" type="button" onClick={onVerify} disabled={verifying}>
        {verifying ? "Verifying..." : "Verify OTP"}
      </Button>

      <Button className="w-full" variant="outline" type="button" onClick={onResend} disabled={resending}>
        {resending ? "Sending..." : "Resend OTP"}
      </Button>

      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
    </div>
  );
}
