"use client";

import { useState } from "react";
import { useForgotPasswordMutation } from "../../../lib/api/authApi";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [forgot, { isLoading, error, isSuccess }] = useForgotPasswordMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgot({ email }).unwrap();
  };

  return (
    <form onSubmit={submit}>
      <input value={email} placeholder="email"
        onChange={(e) => setEmail(e.target.value)} />

      <button disabled={isLoading}>
        {isLoading ? "Sending..." : "Send reset link"}
      </button>

      {isSuccess && <p>Check your email for reset link.</p>}
      {error && <pre>{JSON.stringify((error as any).data ?? error, null, 2)}</pre>}
    </form>
  );
}
