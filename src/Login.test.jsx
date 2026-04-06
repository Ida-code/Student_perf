import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import "@testing-library/jest-dom";

// We mock 'useNavigate' because it only works inside a <BrowserRouter>
const mockedUsedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

describe("Login Component", () => {
  it("should render username and password inputs", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    // Check if the inputs are there
    expect(screen.getByPlaceholderText(/Enter Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Password/i)).toBeInTheDocument();

    // Check if the Login button is there
    const loginButton = screen.getByRole("button", { name: /Login/i });
    expect(loginButton).toBeInTheDocument();
  });
});
