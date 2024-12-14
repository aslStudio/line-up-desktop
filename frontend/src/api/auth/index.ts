import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { setTokens } from "@/store/authSlice";
import { baseQueryWithReauth } from "..";
import { Profile } from "@/types/index";

interface AuthResponse {
  refresh: string;
  access: string;
}

interface RegistrationRequest {
  password: string;
  re_password: string;
  phone: string;
  username: string;
}

interface LoginRequest {
  password: string;
  username: string;
}

interface VerificationCodeRequest {
  random_code: string;
  phone: string;
  new_password?: string;
}

interface VerificationCodeResponse {
  message: string;
}

interface PhoneConfirmRequest {
  phone: string;
}

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  endpoints: (builder) => ({
    registerUser: builder.mutation<void, RegistrationRequest>({
      query: (body) => ({
        url: "/auth/users/",
        method: "POST",
        body,
      }),
    }),

    getMe: builder.query<Profile, void>({
      query: () => ({
        url: "/api/profiles/me",
        method: "GET",
      }),
    }),

    loginUser: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/jwt/create/",
        method: "POST",
        body,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          dispatch(setTokens({ access_token: data.access, refresh_token: data.refresh }));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    sendVerificationCode: builder.mutation<void, PhoneConfirmRequest>({
      query: (body) => ({
        url: "/api/send-confirm-phone-number/",
        method: "POST",
        body,
      }),
    }),

    confirmVerificationCode: builder.mutation<VerificationCodeResponse, VerificationCodeRequest>({
      query: (body) => ({
        url: "/api/check-confirm-phone-number/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useSendVerificationCodeMutation, useConfirmVerificationCodeMutation, useGetMeQuery } = authApi;

export default authApi;
