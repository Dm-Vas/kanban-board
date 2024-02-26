import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { RootState } from "src/store";
import type { User } from "./models/user";
import { API_URL } from "src/consts";
import { apiTags } from "./apiTags";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.jwt;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [apiTags.boards, apiTags.boardDetails],
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => "user",
      providesTags: [apiTags.users],
    }),
    getUserDetails: builder.query<User, string>({
      query: (userId) => `user/${userId}`,
      providesTags: [apiTags.userDetails],
    }),
  }),
});

export const { useGetAllUsersQuery, useGetUserDetailsQuery } = userApi;
