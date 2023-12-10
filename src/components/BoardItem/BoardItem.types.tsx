import { Board } from "../../api/boardApi";

export type BoardItemProps = Pick<Board, "id" | "name" | "totalNumberOfTasks" | "dateOfCreation">;
