import "whatwg-fetch";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";

import { server } from "./server";

expect.extend(matchers);

process.env.DEBUG_PRINT_LIMIT = "15000";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
afterEach(() => cleanup());
