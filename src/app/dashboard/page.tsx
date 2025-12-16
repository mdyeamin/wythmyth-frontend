"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const hydrated = useSelector((state: any) => state.auth.hydrated);

  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    router.replace("/dashboard");
  }, [hydrated, user, router]);

  return null;
}
