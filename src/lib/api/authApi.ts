import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ SIGNUP: /api/auth/signup/
    signup: builder.mutation<
      any,
      | FormData
      | {
          first_name: string;
          last_name: string;
          email: string;
          password: string;
          password2: string;
          phone_number?: string;
          profile_picture?: any;
          is_agree: boolean;
        }
    >({
      query: (body) => ({
        url: "/api/auth/signup/",
        method: "POST",
        body, // FormData হলে multipart auto হবে
      }),
    }),

    // ✅ VERIFY EMAIL/OTP: /api/auth/verify-email/
    verifyEmail: builder.mutation<any, { email: string; otp: string }>({
      query: (body) => ({
        url: "/api/auth/verify-email/",
        method: "POST",
        body,
      }),
    }),

    // ✅ RESEND OTP: /api/auth/resend-otp/
    resendOtp: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: "/api/auth/resend-otp/",
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

    // ✅ CURRENT USER: /api/auth/current-user/
    currentUser: builder.query<any, void>({
      query: () => ({
        url: "/api/auth/current-user/",
        method: "GET",
      }),
    }),

    // ✅ LOGOUT: /api/auth/logout/
    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/api/auth/logout/",
        method: "POST",
      }),
    }),

    // ✅ TOKEN REFRESH (cookie based): /api/auth/token/refresh/
    refreshToken: builder.mutation<any, void>({
      query: () => ({
        url: "/api/auth/token/refresh/",
        method: "POST",
      }),
    }),

    // ✅ SEND RESET EMAIL: /api/auth/send-reset-password-email/
    sendResetPasswordEmail: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: "/api/auth/send-reset-password-email/",
        method: "POST",
        body,
      }),
    }),

    // ✅ RESET PASSWORD: /api/auth/reset-password/{uid}/{token}/
    resetPassword: builder.mutation<
      any,
      { uid: string; token: string; password: string; password2: string }
    >({
      query: ({ uid, token, ...body }) => ({
        url: `/api/auth/reset-password/${encodeURIComponent(uid)}/${encodeURIComponent(
          token
        )}/`,
        method: "POST",
        body, // { password, password2 }
      }),
    }),
  }),
  
  overrideExisting: false,
});

export const {
  useSignupMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useLoginMutation,
  useCurrentUserQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
  useSendResetPasswordEmailMutation,
  useResetPasswordMutation,
} = authApi;
