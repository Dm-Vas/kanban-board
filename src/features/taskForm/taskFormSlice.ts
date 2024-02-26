import type { RootState } from "src/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TaskFormState = {
  isOpen: boolean;
  columnId: string | null;
  taskId?: string | null;
  boardId?: string | null;
};

const initialState: TaskFormState = {
  isOpen: false,
  columnId: null,
  taskId: null,
  boardId: null,
};

const taskFormSlice = createSlice({
  name: "taskForm",
  initialState,
  reducers: {
    openCreateTaskForm: (state, { payload }: PayloadAction<Pick<TaskFormState, "columnId" | "boardId">>) => {
      state.isOpen = true;
      state.boardId = payload.boardId;
      state.columnId = payload.columnId;
    },
    closeTaskForm: (state) => {
      state.isOpen = false;
      state.columnId = null;
      state.taskId = null;
    },
  },
});

export const selectTaskForm = (state: RootState) => state.taskForm;
export const { openCreateTaskForm, closeTaskForm } = taskFormSlice.actions;
export default taskFormSlice.reducer;
