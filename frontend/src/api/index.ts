import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { setTokens, logout } from "@/store/authSlice";

interface AuthResponse {
  access: string;
  refresh: string;
}

let isRefreshing = false;

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && !isRefreshing) {
    console.log(result);
    isRefreshing = true;

    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/jwt/refresh/",
          method: "POST",
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const tokens = refreshResult.data as AuthResponse;
        localStorage.setItem("access_token", tokens.access);
        localStorage.setItem("refresh_token", tokens.refresh);

        api.dispatch(setTokens({ access_token: tokens.access, refresh_token: tokens.refresh }));

        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }

    isRefreshing = false;
  }

  return result;
};

export { baseQueryWithReauth, baseQuery };
