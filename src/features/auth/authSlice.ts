import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse } from "src/api/authApi";
import { RootState } from "src/store";
import Cookies from "universal-cookie";

type AuthState = {
  id: string | null;
  userName: string | null;
  email: string | null;
  roles: string[] | null;
  jwt: string | null;
};

const localStorageJson = localStorage.getItem("user");
const id = localStorageJson ? JSON.parse(localStorageJson).id : null;
const userName = localStorageJson ? JSON.parse(localStorageJson).userName : null;
const email = localStorageJson ? JSON.parse(localStorageJson).email : null;
const roles = localStorageJson ? JSON.parse(localStorageJson).roles : null;
// const jwt = localStorageJson ? JSON.parse(localStorageJson).jwt : null;
const cookies = new Cookies();
const jwt = cookies.get("jwt") ?? null;

const initialState: AuthState = {
  id,
  userName,
  email,
  roles,
  jwt,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<Omit<AuthResponse["data"], "isVerified" | "jwToken" | "refreshToken"> & { jwt: string }>
    ) => {
      state.id = action.payload.id;
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state.roles = action.payload.roles;
      state.jwt = action.payload.jwt;
    },
    logout: (state) => {
      state.id = null;
      state.userName = null;
      state.email = null;
      state.roles = null;
      state.jwt = null;
    },
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
