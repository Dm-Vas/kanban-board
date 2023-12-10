import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "src/store";

type ThemeModeState = {
  mode: "light" | "dark";
};

const localStorageJson = localStorage.getItem("themeMode");
const mode = localStorageJson ? JSON.parse(localStorageJson) : "light";

const initialState: ThemeModeState = {
  mode,
};

const themeModeSlice = createSlice({
  name: "themeMode",
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";

      localStorage.setItem("themeMode", JSON.stringify(state.mode));
    },
  },
});

export const selectThemeMode = (state: RootState) => state.themeMode;
export const { toggleThemeMode } = themeModeSlice.actions;
export default themeModeSlice.reducer;
