import { createApi } from "@reduxjs/toolkit/query/react";
import { Color } from "@/types"; // Assuming Notification is defined in types
import { baseQueryWithReauth } from "..";

interface createLinkRequest {
  max_clicks: number;
  type: "contact" | "event" | "project";
  role?: "organizer" | "participant";
  resource_id: 2147483647;
  profile: 0;
}
export const statusApi = createApi({
  reducerPath: "statusApi",
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

export const { useCreateLinkMutation } = statusApi;

export default statusApi;
