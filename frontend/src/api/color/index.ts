import { createApi } from "@reduxjs/toolkit/query/react";
import { Color } from "@/types"; // Assuming Notification is defined in types
import { baseQueryWithReauth } from "..";

export const colorsApi = createApi({
  reducerPath: "colorsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getColors: builder.query<Color[], void>({
      query: () => "/api/color",
    }),
  }),
});

export const { useGetColorsQuery } = colorsApi;

export default colorsApi;
