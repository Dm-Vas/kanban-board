import { Task } from "../../api/boardApi";

export type TaskItemProps = Pick<Task, "title" | "dateOfCreation"> & {
  isDragging: boolean;
};
