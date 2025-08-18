import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import App from "../App"; // Adjust the path as needed

describe("App Component", () => {
  test("renders Navbar and Hero component by default", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText(/welcome/i)).toBeInTheDocument(); // Adjust based on Hero content
  });

  test("navigates to Signup page", async () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/sign up/i)).toBeInTheDocument(); // Adjust based on Signup content
  });

  test("navigates to Login page", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument(); // Adjust based on Login content
  });

  test("navigates to Child Dashboard", async () => {
    render(
      <MemoryRouter initialEntries={["/child-dashboard"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/child dashboard/i)).toBeInTheDocument();
  });

  test("navigates to Parent Dashboard", async () => {
    render(
      <MemoryRouter initialEntries={["/parent-dashboard"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/parent dashboard/i)).toBeInTheDocument();
  });

  test("navigates to Teacher Dashboard", async () => {
    render(
      <MemoryRouter initialEntries={["/teacher-dashboard"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/teacher dashboard/i)).toBeInTheDocument();
  });

  test("navigates to Admin Dashboard", async () => {
    render(
      <MemoryRouter initialEntries={["/admin-dashboard"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  });

  test("navigates to Terms page", async () => {
    render(
      <MemoryRouter initialEntries={["/terms"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/terms/i)).toBeInTheDocument();
  });

  test("navigates to Permissions page", async () => {
    render(
      <MemoryRouter initialEntries={["/permissions"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/permissions/i)).toBeInTheDocument();
  });

  test("navigates using links", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    const signupLink = screen.getByText(/sign up/i);
    await user.click(signupLink);
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();

    const loginLink = screen.getByText(/login/i);
    await user.click(loginLink);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
