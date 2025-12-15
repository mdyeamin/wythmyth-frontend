"use client";

import { useState } from "react";
import { useSendResetPasswordEmailMutation } from "../../../lib/api/authApi";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const [sendReset, { isLoading, error }] = useSendResetPasswordEmailMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    try {
      await sendReset({ email }).unwrap();
      setMsg("✅ Reset link sent. Please check your email.");
    } catch (e: any) {
      setMsg(e?.data?.message || "❌ Failed to send reset email.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button disabled={isLoading}>
        {isLoading ? "Sending..." : "Send reset link"}
      </button>

      {msg && <p>{msg}</p>}
      {error && <pre>{JSON.stringify((error as any)?.data ?? error, null, 2)}</pre>}
    </form>
  );
}
