"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "../../../lib/api/authApi";

export default function ResetPasswordForm({
  uid,
  token,
}: {
  uid: string;
  token: string;
}) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (password.length < 8) {
      setMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== password2) {
      setMsg("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ uid, token, password, password2 }).unwrap();
      setMsg("✅ Password reset successful! Please login.");
      router.replace("/login");
    } catch (e: any) {
      // error UI নিচে দেখাবে
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="password"
        value={password}
        placeholder="New password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        value={password2}
        placeholder="Confirm new password"
        onChange={(e) => setPassword2(e.target.value)}
      />

      <button disabled={isLoading}>
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>

      {msg && <p>{msg}</p>}

      {error && (
        <pre>{JSON.stringify((error as any)?.data ?? error, null, 2)}</pre>
      )}
    </form>
  );
}
