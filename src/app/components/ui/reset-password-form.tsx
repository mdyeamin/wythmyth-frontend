"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "../../../lib/api/authApi";

export default function ResetPasswordForm({ uid, token }: { uid: string; token: string }) {
  const router = useRouter();
  const [new_password, setNewPassword] = useState("");
  const [reset, { isLoading, error, isSuccess }] = useResetPasswordMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await reset({ uid, token, new_password }).unwrap();
    router.push("/login");
  };

  return (
    <form onSubmit={submit}>
      <input
        type="password"
        value={new_password}
        placeholder="new password"
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button disabled={isLoading}>
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>

      {isSuccess && <p>Password reset successful!</p>}
      {error && <pre>{JSON.stringify((error as any).data ?? error, null, 2)}</pre>}
    </form>
  );
}
