import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { ConfirmationKey } from "src//components/ConfirmationDialog/ConfirmationDialog.types";
import type { RootState } from "src/store";

type ConfirmationDialogSliceState = {
  isOpen: boolean;
  title: string;
  content: string;
  confirmationButtonLabel: string;
  confirmationKey: ConfirmationKey | null;
  deleteItemId?: string | null;
};

const initialState: ConfirmationDialogSliceState = {
  isOpen: false,
  title: "",
  content: "",
  confirmationButtonLabel: "",
  confirmationKey: null,
  deleteItemId: null,
};

const confirmationDialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openConfirmationDialog: (state, action: PayloadAction<Omit<ConfirmationDialogSliceState, "isOpen">>) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.confirmationButtonLabel = action.payload.confirmationButtonLabel;
      state.confirmationKey = action.payload.confirmationKey;
      state.deleteItemId = action.payload.deleteItemId;
    },
    closeConfirmationDialog: (state) => {
      state.isOpen = false;
    },
  },
});

export const selectConfirmationDialog = (state: RootState) => state.dialog;
export const { openConfirmationDialog, closeConfirmationDialog } = confirmationDialogSlice.actions;
export default confirmationDialogSlice.reducer;
