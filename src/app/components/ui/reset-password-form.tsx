"use client";

import { useMemo, useState } from "react";
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

  // Debug (dev only) - চাইলে পরে remove করতে পারো
  console.log("uid:", uid);
  console.log("token:", token);

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const serverErrorText = useMemo(() => {
    const e: any = error;
    const data = e?.data;
    if (!data) return null;

    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.detail) return data.detail;

    // fallback
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return "Something went wrong.";
    }
  }, [error]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!uid || !token) {
      setMsg("❌ Invalid reset link (uid/token missing). Please request again.");
      return;
    }

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
      setMsg("✅ Password reset successful! Redirecting to login...");
      router.replace("/login");
    } catch {
      // serverErrorText এ দেখাবে
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 max-w-md">
      <h1 className="text-xl font-semibold">Reset Password</h1>

      <input
        className="w-full rounded border p-2"
        type="password"
        value={password}
        placeholder="New password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        className="w-full rounded border p-2"
        type="password"
        value={password2}
        placeholder="Confirm new password"
        onChange={(e) => setPassword2(e.target.value)}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>

      {msg && <p className="text-sm">{msg}</p>}

      {serverErrorText && (
        <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">
          <pre className="whitespace-pre-wrap">{serverErrorText}</pre>
        </div>
      )}
    </form>
  );
}
