import { createSlice } from "@reduxjs/toolkit";
import { storage } from "../utils/storage";

type AuthState = {
  token: string | null;
  user: any | null;
};

const initialState: AuthState = {
  token: storage.getToken(),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload || {};
      state.token = token ?? null;
      state.user = user ?? null;
      if (token) storage.setToken(token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      storage.removeToken();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
