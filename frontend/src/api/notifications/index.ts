import { createApi } from "@reduxjs/toolkit/query/react";
import {
  Notification,
  NotificationForExecutor,
  NotificationForOrganizer,
} from "@/types"; // Assuming Notification is defined in types
import { baseQueryWithReauth } from "..";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getNotifications: builder.query<
      Array<Notification | NotificationForExecutor | NotificationForOrganizer>,
      void
    >({
      query: () => "/api/notification",
    }),

    getNotificationById: builder.query<
      NotificationForExecutor | NotificationForExecutor | Notification,
      number
    >({
      query: (id) => `/api/notification/${id}`,
    }),

    getFilteredNotifications: builder.query<
      Array<Notification | NotificationForExecutor | NotificationForOrganizer>,
      { is_read?: boolean; is_archived?: boolean; recipient_type?: string }
    >({
      query: (params) => ({
        url: "/api/notification/filter/",
        method: "GET",
        params,
      }),
    }),
    updateNotificationById: builder.mutation<
      Notification,
      { id: number; updateData: Partial<Notification> }
    >({
      query: ({ id, updateData }) => ({
        url: `/api/notification/${id}/`,
        method: "PATCH",
        body: updateData,
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useGetFilteredNotificationsQuery,
  useUpdateNotificationByIdMutation,
} = notificationsApi;

export default notificationsApi;
