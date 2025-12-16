"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUserQuery } from "../api/authApi";
import { setUser, clearUser } from "./authSlice";

export default function AuthHydrator() {
  const dispatch = useDispatch();

  const alreadyHydrated = useSelector((state: any) => state.auth?.hydrated);

  const { data, isFetching, isLoading, isSuccess, isUninitialized } =
    useCurrentUserQuery(undefined, { skip: !!alreadyHydrated });

  const hydratedOnce = useRef(false);

  useEffect(() => {
    if (hydratedOnce.current) return;
    if (alreadyHydrated) return;

    const requestDone = !isLoading && !isFetching && !isUninitialized;
    if (!requestDone) return;

    const user = data?.data?.user ?? (data as any)?.user ?? null;

    if (isSuccess && user) dispatch(setUser(user));
    else dispatch(clearUser());

    hydratedOnce.current = true;
  }, [alreadyHydrated, data, dispatch, isFetching, isLoading, isSuccess, isUninitialized]);

  return null;
}
