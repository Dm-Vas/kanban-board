import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { AuthResponse, RegisterResponse } from "./models/auth";
import { LoginFormValues, RegisterFormValues } from "src/models/forms";
import { API_URL } from "src/consts";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterFormValues>({
      query(data) {
        return {
          url: "Account/register",
          method: "POST",
          body: data,
        };
      },
    }),
    login: builder.mutation<AuthResponse, LoginFormValues>({
      query: (credentials) => {
        return {
          url: "Account/authenticate",
          method: "POST",
          body: credentials,
        };
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
