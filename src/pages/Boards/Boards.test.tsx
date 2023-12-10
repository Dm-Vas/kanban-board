import { rest } from "msw";
import { screen, waitFor } from "@testing-library/react";

import { apiUrl } from "../../api/boardApi";
import { server } from "../../test/server";
import { renderWithProviders } from "../../test/test-utils";

import { Boards } from "./Boards";

const setup = () => renderWithProviders(<Boards />);

describe("Boards page", () => {
  it("Should display all boards", async () => {
    setup();

    expect(screen.getByText(/loading/i)).toBeVisible();

    const boards = await screen.findAllByText(/board name/i);

    expect(boards).toHaveLength(2);
    boards.forEach((board) => expect(board).toBeVisible());
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it("Should display error message", async () => {
    server.use(rest.get(`${apiUrl}board`, (req, res, ctx) => res(ctx.status(500))));

    setup();

    expect(screen.getByText(/loading/i)).toBeVisible();

    // expect(await screen.findByText(/error/i)).toBeVisible();

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeVisible();
    });

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
