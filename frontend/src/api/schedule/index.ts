import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Project } from "@/types";

export const scheduleApi = createApi({
  reducerPath: "scheduleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({
    getSchedule: builder.query<Project[], void>({
      query: () => "/api/schedule",
    }),

    getScheduleById: builder.query<Project, number>({
      query: (id) => `/api/schedule/${id}`,
    }),
  }),
});

export const { useGetScheduleQuery, useGetScheduleByIdQuery } = scheduleApi;

export default scheduleApi;
