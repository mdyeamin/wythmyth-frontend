"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../lib/api/authApi";
import { logout as logoutAction } from "../../lib/auth/authSlice";

export default function LogoutButton() {
  const router = useRouter();
  const dispatch = useDispatch();

  // 🔑 api logout → rename করা হলো
  const [apiLogout, { isLoading }] = useLogoutMutation();

  const onLogout = async () => {
    try {
      // backend logout (cookie clear)
      await apiLogout().unwrap();
    } catch (e) {
      // backend fail হলেও client clear হবে
      console.warn("Backend logout failed, clearing client state");
    } finally {
      // redux clear
      dispatch(logoutAction());
      router.replace("/login");
    }
  };

  return (
    <button onClick={onLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}
