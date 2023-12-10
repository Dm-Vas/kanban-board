import { describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { Login } from "./Login";

const user = userEvent.setup();
const setup = () =>
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

describe("Login page", () => {
  it("Should render Login page with heading", () => {
    setup();

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toHaveTextContent(/login/i);
    expect(heading).toBeVisible();
  });

  it("Should render Login page with email field", () => {
    setup();

    expect(screen.getByLabelText(/email/i)).toBeVisible();
  });

  it("Should render Login page with password field", () => {
    setup();

    expect(screen.getByLabelText(/password/i)).toBeVisible();
  });

  it("Should render Login page with login button", () => {
    setup();

    expect(screen.getByRole("button", { name: /log in/i })).toBeVisible();
  });

  it("Should render Login page with link to register page", () => {
    setup();

    const link = screen.getByRole("link", { name: /register/i });

    expect(link).toBeVisible();
    expect(link).toHaveAttribute("href", "/register");
  });

  it("Should display errors when login button is clicked and both fields are empty", async () => {
    setup();

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByText(/email is required/i)).toBeVisible();
    expect(screen.getByText(/password is required/i)).toBeVisible();
  });

  it("Should display an error when login button is clicked and email field is empty", async () => {
    setup();

    await user.type(screen.getByLabelText(/email/i), "Email");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByText(/password is required/i)).toBeVisible();
  });

  it("Should display an error when login button is clicked and password field is empty", async () => {
    setup();

    await user.type(screen.getByLabelText(/password/i), "Password");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByText(/email is required/i)).toBeVisible();
  });
});
