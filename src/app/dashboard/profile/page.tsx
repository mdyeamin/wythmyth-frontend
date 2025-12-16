"use client";

import { useSelector } from "react-redux";

export default function ProfilePage() {
  const user = useSelector((state: any) => state.auth.user);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Profile</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
