import { describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { Register } from "./Register";

const user = userEvent.setup();
const setup = () =>
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );

describe("Register page", () => {
  it("Should render Register page with heading", () => {
    setup();

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toHaveTextContent(/register/i);
    expect(heading).toBeVisible();
  });

  it("Should render Register page with first name field", () => {
    setup();

    expect(screen.getByLabelText(/first name/i)).toBeVisible();
  });

  it("Should render Register page with last name field", () => {
    setup();

    expect(screen.getByLabelText(/last name/i)).toBeVisible();
  });

  it("Should render Register page with register button", () => {
    setup();

    expect(screen.getByRole("button", { name: /register/i })).toBeVisible();
  });

  it("Should render Register page with link to login page", () => {
    setup();

    const link = screen.getByRole("link", { name: /log in/i });

    expect(link).toBeVisible();
    expect(link).toHaveAttribute("href", "/login");
  });

  it("Should display errors when login button is clicked and all fields are empty", async () => {
    setup();

    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(screen.getByText(/first name is required/i)).toBeVisible();
    expect(screen.getByText(/last name is required/i)).toBeVisible();
    expect(screen.getByText(/email is required/i)).toBeVisible();
    // expect(screen.getByText(/password is required/i)).toBeVisible();
    // expect(screen.getByText(/confirm password is required/i)).toBeVisible();
  });

  it("Should display errors when login button is clicked and first name field is empty", async () => {
    setup();

    await user.type(screen.getByLabelText(/last name/i), "Last name");
    await user.type(screen.getByLabelText(/email/i), "Email");
    // await user.type(screen.getByLabelText(/password/i), "Password");
    // await user.type(screen.getByLabelText(/confirm password/i), "Confirm Password");

    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(screen.getByText(/first name is required/i)).toBeVisible();
    expect(screen.queryByText(/last name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    // expect(screen.queryByText(/password is required/i)).not.toBeInTheDocument();
    // expect(screen.queryByText(/confirm password is required/i)).not.toBeInTheDocument();
  });
});
