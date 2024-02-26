import Cookies from "universal-cookie";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { combineReducers, configureStore, Middleware, PreloadedState } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";

import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { boardApi } from "./api/boardApi";
import dialogReducer from "./features/confirmationDialog/confirmationDialogSlice";
import singleInputReducer from "./features/singleInputForm/singleInputFormSlice";
import themeModeSliceReducer from "./features/themeMode/themeModeSlice";
import authReducer, { login, logout } from "./features/auth/authSlice";
import taskReducer from "./features/taskForm/taskFormSlice";
import alertReducer from "./features/alert/alertSlice";

const userKey = "user";
const jwtKey = "jwt";

const authMiddleware: Middleware<object, RootState> = () => (next) => (action) => {
  const cookies = new Cookies();

  if (login.match(action)) {
    cookies.set(jwtKey, action.payload.jwt);

    localStorage.setItem(
      userKey,
      JSON.stringify({
        id: action.payload.id,
        userName: action.payload.userName,
        email: action.payload.email,
        roles: action.payload.roles,
      })
    );
  } else if (logout.match(action)) {
    cookies.remove(jwtKey, { path: "/" });
    localStorage.removeItem(userKey);
  }

  return next(action);
};

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [boardApi.reducerPath]: boardApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  auth: authReducer,
  dialog: dialogReducer,
  alert: alertReducer,
  taskForm: taskReducer,
  singleInputForm: singleInputReducer,
  themeMode: themeModeSliceReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([authMiddleware, authApi.middleware, boardApi.middleware, userApi.middleware]),
    preloadedState,
  });
};

setupListeners(setupStore().dispatch);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
