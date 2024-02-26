import type { Task } from "src/api/models/board";

export type TaskItemProps = Pick<Task, "title" | "dateOfCreation" | "userAttached"> & {
  isDragging: boolean;
};
