import { createApi } from "@reduxjs/toolkit/query/react";
import { Project } from "@/types";
import { baseQueryWithReauth } from "..";

interface DeleteRequest {
  id: number;
}

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => "/api/projects",
    }),
    getProjectsWithSearch: builder.query<Project[], string>({
      query: (filters) => `/api/projects/search?${filters}`,
    }),
    getProjectById: builder.query<Project, number>({
      query: (id) => `/api/projects/${id}`,
    }),
    deleteProject: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/projects/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const { useGetProjectsQuery, useGetProjectByIdQuery, useGetProjectsWithSearchQuery, useDeleteProjectMutation } = projectsApi;

export default projectsApi;
