import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ SIGNUP: /api/auth/signup/
    signup: builder.mutation<
      any,
      {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        password2: string;
        phone_number?: string;
        profile_picture?: string;
        is_agree: boolean;
      }
    >({
      query: (body) => ({
        url: "/api/auth/signup/",
        method: "POST",
        body,
      }),
    }),

    // ✅ LOGIN: /api/auth/login/
    login: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({
        url: "/api/auth/login/",
        method: "POST",
        body,
      }),
    }),

    // ⛳️ এগুলো backend থেকে confirm না হওয়া পর্যন্ত placeholder
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: "/api/auth/forgot-password/", // ⚠️ backend এ যেটা আছে সেটাই দিতে হবে
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<any, { uid: string; token: string; new_password: string }>({
      query: (body) => ({
        url: "/api/auth/reset-password/", // ⚠️ backend এ যেটা আছে সেটাই দিতে হবে
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
