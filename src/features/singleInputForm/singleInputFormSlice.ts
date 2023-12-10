import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "src/store";

type SingleInputFormState = {
  isOpen: boolean;
  type: "rename-board" | "add-column" | "rename-column" | null;
  entityId: string | undefined;
  oldName?: string;
};

const initialState: SingleInputFormState = {
  isOpen: false,
  type: null,
  entityId: undefined,
  oldName: undefined,
};

const singleInputFormSlice = createSlice({
  name: "singleInputForm",
  initialState,
  reducers: {
    openSingleInputForm: (state, action: PayloadAction<Omit<SingleInputFormState, "isOpen">>) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.entityId = action.payload.entityId;
      state.oldName = action.payload.oldName;
    },
    closeSingleInputForm: (state) => {
      state.isOpen = false;
    },
  },
});

export const selectSingleInputForm = (state: RootState) => state.singleInputForm;
export const { openSingleInputForm, closeSingleInputForm } = singleInputFormSlice.actions;
export default singleInputFormSlice.reducer;
