"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCurrentUserQuery } from "../api/authApi";
import { setCredentials, logout } from "./authSlice";

export default function AuthHydrator() {
  const dispatch = useDispatch();
  const { data, error } = useCurrentUserQuery();

  useEffect(() => {
    if (data?.success) {
      dispatch(
        setCredentials({
          user: data.data.user,
          token: null, // cookie-based auth, token frontend এ দরকার নেই
        })
      );
    }

    if (error) {
      dispatch(logout());
    }
  }, [data, error, dispatch]);

  return null;
}
