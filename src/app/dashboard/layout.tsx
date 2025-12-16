"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { logout } from "../../lib/auth/authSlice";
import { useLogoutMutation } from "../../lib/api/authApi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.auth.user);
  const hydrated = useSelector((state: any) => state.auth.hydrated);

  const [logoutApi, { isLoading }] = useLogoutMutation();

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  const handleLogout = async () => {
    try {
      await logoutApi(undefined).unwrap();
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      dispatch(logout());
      router.replace("/login");
    }
  };

  if (!hydrated) return null;
  if (!user) return null;

  const navItemClass = (href: string) =>
    `block w-full rounded-md px-3 py-2 text-sm transition ${
      pathname === href ? "bg-black text-white" : "hover:bg-gray-100"
    }`;

  return (
    <div className="flex min-h-screen">
      {/* 🔹 Sidebar */}
      <aside className="w-64 border-r p-4 flex flex-col justify-between">
        <div>
          <h2 className="font-semibold text-lg mb-4">Dashboard</h2>

          <nav className="space-y-2">
            <Link href="/dashboard/profile" className={navItemClass("/dashboard/profile")}>
              Profile
            </Link>

            <Link href="/dashboard/settings" className={navItemClass("/dashboard/settings")}>
              Settings
            </Link>
          </nav>
        </div>

        {/* 🚪 Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full rounded-md bg-black px-4 py-2 text-white cursor-pointer disabled:opacity-60"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </aside>

      {/* 🔹 Main */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
