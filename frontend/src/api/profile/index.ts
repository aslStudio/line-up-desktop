import { createApi } from "@reduxjs/toolkit/query/react";
import { Profile } from "@/types";
import { baseQueryWithReauth } from "..";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, number>({
      query: (id) => `/api/profiles/${id}`,
    }),

    updateProfile: builder.mutation<void, Partial<Profile>>({
      query: (body) => ({
        url: `/api/profiles/${body.id}/`,
        method: "PATCH",
        body,
      }),
    }),
    updateProfilSettings: builder.mutation<void, Partial<Profile>>({
      query: (body) => ({
        url: `/api/profiles/${body.id}/profile-settings/ `,
        method: "PATCH",
        body,
      }),
    }),

    searchProfiles: builder.query<Profile[], string>({
      query: (name) => `/api/profiles/search?name=${name}`,
    }),

    removeProfile: builder.mutation<void, { id: number; profile_id: number; role: "contact" | "blocked_contact" }>({
      query: (body) => ({
        url: `profiles/${body.id}/remove_profile/`,
        method: "POST",
        body,
      }),
    }),

    addProfile: builder.mutation<void, { id: number; profile_id: number; role: "contact" | "blocked_contact" }>({
      query: (body) => ({
        url: `profiles/${body.id}/add_profile/`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useUpdateProfilSettingsMutation, useLazyGetProfileQuery, useSearchProfilesQuery, useRemoveProfileMutation } = profileApi;

export default profileApi;
