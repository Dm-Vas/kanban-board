import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type BoardFormState = {
  isOpen: boolean;
  editedBoardId: string | null;
};

const initialState: BoardFormState = {
  isOpen: false,
  editedBoardId: null,
};

const boardFormSlice = createSlice({
  name: "boardForm",
  initialState,
  reducers: {
    openCreateNewBoardForm: (state) => {
      state.isOpen = true;
    },
    openEditBoardForm: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.editedBoardId = action.payload;
    },
    closeBoardForm: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openCreateNewBoardForm, closeBoardForm } = boardFormSlice.actions;
export default boardFormSlice.reducer;
