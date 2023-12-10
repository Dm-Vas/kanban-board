import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useGetBoardDetailsQuery } from "src/api/boardApi";

export const useGetTaskStatuses = (boardId: string | undefined) => {
  const { data: boardDetails } = useGetBoardDetailsQuery(boardId ?? skipToken);

  return boardDetails?.columns.map((column) => ({
    status: column.name,
    columnId: column.id,
  }));
};
