import { createApi } from "@reduxjs/toolkit/query/react";
import { Subgroup } from "@/types"; // Assuming Subgroup is defined in types
import { baseQueryWithReauth } from "..";

export const subgroupsApi = createApi({
  reducerPath: "subgroupsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getSubgroups: builder.query<Subgroup[], void>({
      query: () => "/api/subgroups",
    }),

    getSubgroupById: builder.query<Subgroup, number>({
      query: (id) => `/api/subgroups/${id}`,
    }),

    createSubgroup: builder.mutation<Subgroup, Partial<Subgroup>>({
      query: (newSubgroup) => ({
        url: "/api/subgroups/",
        method: "POST",
        body: newSubgroup,
      }),
    }),
  }),
});

export const {
  useGetSubgroupsQuery,
  useGetSubgroupByIdQuery,
  useCreateSubgroupMutation,
} = subgroupsApi;

export default subgroupsApi;
