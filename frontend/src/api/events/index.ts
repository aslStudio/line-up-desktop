import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Event, EventData } from "@/types";
import { baseQueryWithReauth } from "..";

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getEvents: builder.query<EventData[], void>({
      query: () => "/api/specific_events",
    }),
    getEventById: builder.query<EventData, number>({
      query: (id) => `/api/specific_events/${id}`,
    }),

    getEventsWithFilters: builder.query<EventData[], string>({
      query: (filters) => `/api/specific_events/search?${filters}`,
    }),
    getEventsFromSearch: builder.query<EventData[], string>({
      query: (name) => `/api/specific_events/global_search?name=${name}`,
    }),
  }),
});

export const { useGetEventsQuery, useGetEventByIdQuery, useGetEventsFromSearchQuery, useGetEventsWithFiltersQuery } = eventsApi;

export default eventsApi;
