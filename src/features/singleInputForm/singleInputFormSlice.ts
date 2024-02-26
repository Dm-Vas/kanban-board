import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "src/store";

type SingleInputFormState = {
  isOpen: boolean;
  type: "create-board" | "rename-board" | "add-column" | "rename-column" | null;
  entityId?: string | null;
  oldName?: string | null;
};

const initialState: SingleInputFormState = {
  isOpen: false,
  type: null,
  entityId: null,
  oldName: null,
};

const singleInputFormSlice = createSlice({
  name: "singleInputForm",
  initialState,
  reducers: {
    openSingleInputForm: (state, { payload }: PayloadAction<Omit<SingleInputFormState, "isOpen">>) => {
      state.isOpen = true;
      state.type = payload.type;
      state.entityId = payload.entityId;
      state.oldName = payload.oldName;
    },
    closeSingleInputForm: (state) => {
      state.isOpen = false;
      state.type = null;
      state.entityId = null;
      state.oldName = null;
    },
  },
});

export const selectSingleInputForm = (state: RootState) => state.singleInputForm;
export const { openSingleInputForm, closeSingleInputForm } = singleInputFormSlice.actions;
export default singleInputFormSlice.reducer;
