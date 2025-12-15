"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "../../app/components/logout-button";

export default function DashboardPage() {
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">
        Welcome, {user?.email}
      </h1>

      {/* 🔓 Logout */}
      <LogoutButton />
    </div>
  );
}
