import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { LoginFormValues, RegisterFormValues } from "src/models/forms";
import { RootState } from "src/store";

export type AuthResponse = {
  succeeded: boolean;
  message: string;
  data: {
    id: string;
    userName: string;
    email: string;
    roles: string[];
    isVerified: boolean;
    jwToken: string;
    refreshToken: string;
  };
};

type RegisterResponse = {
  succeeded: boolean;
  message: string;
  data: string;
};

export const apiUrl = import.meta.env.VITE_API_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
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
