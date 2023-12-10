import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TaskFormState = {
  isOpen: boolean;
  columnId: string | null;
  columnName: string | null;
  taskId?: string | null;
};

const initialState: TaskFormState = {
  isOpen: false,
  columnId: null,
  columnName: null,
  taskId: null,
};

const taskFormSlice = createSlice({
  name: "taskForm",
  initialState,
  reducers: {
    openCreateTaskForm: (state, action: PayloadAction<Pick<TaskFormState, "columnId" | "columnName">>) => {
      state.isOpen = true;
      state.columnId = action.payload.columnId;
      state.columnName = action.payload.columnName;
    },
    openEditTaskForm: (state, action: PayloadAction<Omit<TaskFormState, "isOpen">>) => {
      state.isOpen = true;
      state.columnId = action.payload.columnId;
      state.columnName = action.payload.columnName;
      state.taskId = action.payload.taskId;
    },
    closeTaskForm: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openCreateTaskForm, openEditTaskForm, closeTaskForm } = taskFormSlice.actions;
export default taskFormSlice.reducer;
