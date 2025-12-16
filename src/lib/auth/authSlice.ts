import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  user: any | null;

  // ✅ current-user check শেষ হয়েছে কিনা (বা login/logout হয়েছে কিনা)
  hydrated: boolean;
};

const initialState: AuthState = {
  user: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.hydrated = true;
    },

    logout: (state) => {
      state.user = null;
      state.hydrated = true;
    },

    clearUser: (state) => {
      state.user = null;
      state.hydrated = true;
    },
  },
});

export const { setUser, logout, clearUser } = authSlice.actions;
export default authSlice.reducer;
