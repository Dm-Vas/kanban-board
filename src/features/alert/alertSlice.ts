import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertProps } from "@mui/material";

import { RootState } from "src/store";

export type AlertState = Pick<AlertProps, "severity"> & {
  shown: boolean;
  title?: string;
  message: string;
};

const initialState: AlertState = {
  shown: false,
  title: "",
  message: "",
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<Omit<AlertState, "shown">>) => {
      state.shown = true;
      state.severity = action.payload.severity;
      state.title = action.payload.title;
      state.message = action.payload.message;
    },
    hideAlert: (state) => {
      state.shown = false;
    },
  },
});

export const selectAlert = (state: RootState) => state.alert;
export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;
