import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "..";

interface createLinkRequest {
  max_clicks: number;
  type: "contact" | "event" | "project";
  role?: "organizer" | "participant";
  resource_id: number;
  profile: number;
}
export const linkApi = createApi({
  reducerPath: "linkApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createLink: builder.mutation<void, createLinkRequest>({
      query: (body) => ({
        url: "/api/create-link",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateLinkMutation } = linkApi;

export default linkApi;
