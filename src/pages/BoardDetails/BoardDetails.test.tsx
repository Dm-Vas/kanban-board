import { rest } from "msw";
import { screen, waitFor } from "@testing-library/react";

import { Board, apiUrl } from "../../api/boardApi";
import { server } from "../../test/server";
import { renderWithProviders } from "../../test/test-utils";

import { BoardDetails } from "./BoardDetails";

import { vi } from "vitest";

const setup = () => renderWithProviders(<BoardDetails />);

describe("BoardDetails page", () => {
  it("Should display board with columns", async () => {
    vi.mock("react-router-dom", async () => {
      const mod = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

      return {
        ...mod,
        useParams: vi.fn().mockReturnValue({ boardId: "1" }),
      };
    });

    setup();

    expect(screen.getByText(/loading.../i)).toBeVisible();

    expect(await screen.findByText(/to do/i)).toBeVisible();

    expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
  });

  it("Should display error message", async () => {
    server.use(rest.get(`${apiUrl}board/:id`, (_, res, ctx) => res(ctx.status(500))));

    setup();

    expect(screen.getByText(/loading.../i)).toBeVisible();

    // expect(await screen.findByText(/error/i)).toBeVisible();

    await waitFor(() => {
      expect(screen.getByText(/error.../i)).toBeVisible();
    });

    expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
  });
});
