import type { Board } from "src/api/models/board";

export type BoardItemProps = Pick<Board, "id" | "name" | "totalNumberOfTasks" | "dateOfCreation">;
