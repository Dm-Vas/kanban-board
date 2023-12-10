import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "src/store";
import { apiTags } from "./apiTags";

export type Board = {
  id: string;
  order: number;
  name: string;
  columns: Column[];
  dateOfCreation: string;
  dateOfModification: string;
  totalNumberOfTasks?: number;
};

type Column = {
  id: string;
  name: string;
  order: number;
  tasks: Task[];
  dateOfCreation: string;
  dateOfModification: string;
};

export type Task = {
  userAttached: string;
  title: string;
  description: string;
  status: string;
  id: string;
  columnId: string;
  order: number;
  dateOfCreation: string;
  dateOfModification: string;
  parents: {
    id: string;
    isCompleted: boolean;
    status: string;
    title: string;
  }[];
};

export type Subtask = {
  id: string;
  title: string;
  isCompleted: boolean;
  status: string;
};

export const apiUrl = import.meta.env.VITE_API_URL;

export const boardApi = createApi({
  reducerPath: "boardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.jwt;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [apiTags.boards, apiTags.boardDetails],
  endpoints: (builder) => ({
    getAllBoards: builder.query<Board[], void>({
      query: () => "board",
      providesTags: [apiTags.boards],
    }),
    getBoardDetails: builder.query<Board, Board["id"]>({
      query: (boardId) => `board/${boardId}`,
      providesTags: [apiTags.boardDetails],
    }),

    // BOARD
    createBoard: builder.mutation<
      Board,
      {
        name: string;
        columns: {
          name: string;
        }[];
      }
    >({
      query(board) {
        return {
          url: "board",
          method: "POST",
          body: board,
        };
      },
      invalidatesTags: [apiTags.boards],
    }),
    editBoard: builder.mutation<void, Pick<Board, "id" | "name">>({
      query({ id, name }) {
        return {
          url: `board/${id}`,
          method: "PUT",
          body: { name },
        };
      },
      invalidatesTags: [apiTags.boards],
    }),
    deleteBoard: builder.mutation<void, Board["id"]>({
      query(boardId) {
        return {
          url: `board/${boardId}`,
          method: "DELETE",
          body: boardId,
        };
      },
      invalidatesTags: [apiTags.boards],
    }),

    // COLUMN
    createColumn: builder.mutation<void, Pick<Column, "name"> & { boardId: string }>({
      query(column) {
        return {
          url: `column`,
          method: "POST",
          body: column,
        };
      },
      invalidatesTags: [apiTags.boardDetails],
    }),
    editColumn: builder.mutation<void, Pick<Column, "id" | "name"> & { boardId: string }>({
      query(column) {
        return {
          url: `column/${column.id}`,
          method: "PUT",
          body: column,
        };
      },
      invalidatesTags: [apiTags.boardDetails],
    }),
    deleteColumn: builder.mutation<void, Column["id"]>({
      query(columnId) {
        return {
          url: `column/${columnId}`,
          method: "DELETE",
          body: columnId,
        };
      },
      invalidatesTags: [apiTags.boardDetails],
    }),

    // TASK
    createTask: builder.mutation<void, { task: Partial<Task> }>({
      query({ task }) {
        return {
          url: `task`,
          method: "POST",
          body: task,
        };
      },
      invalidatesTags: [apiTags.boardDetails],
    }),
    editTask: builder.mutation<void, Partial<Task>>({
      query(task) {
        return {
          url: `task/${task.id}`,
          method: "PUT",
          body: task,
        };
      },
      invalidatesTags: [apiTags.boardDetails],
    }),

    moveTask: builder.mutation<void, { taskId: string; columnTargetId: string; order: number }>({
      query({ taskId, ...payload }) {
        return {
          url: `task/${taskId}/move`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: [apiTags.boardDetails],
    }),

    deleteTask: builder.mutation<void, { taskId: Task["id"] }>({
      query({ taskId }) {
        return {
          url: `task/${taskId}`,
          method: "DELETE",
          body: taskId,
        };
      },
      invalidatesTags: [apiTags.boardDetails],
    }),
  }),
});

export const {
  useGetAllBoardsQuery,
  useGetBoardDetailsQuery,

  useCreateBoardMutation,
  useEditBoardMutation,
  useDeleteBoardMutation,

  useCreateColumnMutation,
  useEditColumnMutation,
  useDeleteColumnMutation,

  useCreateTaskMutation,
  useEditTaskMutation,
  useMoveTaskMutation,

  useDeleteTaskMutation,
} = boardApi;
