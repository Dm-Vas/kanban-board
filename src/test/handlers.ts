import { rest } from "msw";

import { Board, apiUrl } from "../api/boardApi";
import { boardsMocks } from "./mocks/api/boardsMocks";
import { boardDetailsMocks } from "./mocks/api/boardDetailsMocks";

export const handlers = [
  rest.get(`${apiUrl}board`, (req, res, ctx) => res(ctx.status(200), ctx.json<Board[]>(boardsMocks))),

  rest.get(`${apiUrl}board/:boardId`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json<Board>({ ...boardDetailsMocks, id: String(req.params.boardId) }))
  ),
];
