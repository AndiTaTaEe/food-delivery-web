import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import App from "./App";
import "@testing-library/jest-dom";

vi.mock("./components/Navbar/Navbar", () => ({
  default: () => <div data-testid="navbar-mock">Navbar Component</div>,
}));

vi.mock("./components/Sidebar/Siderbar", () => ({
  default: () => <div data-testid="sidebar-mock"> Sidebar Component</div>,
}));

vi.mock("./pages/Add/Add", () => ({
  default: ({ url }) => (
    <div data-testid="add-mock"> Add Component with URL: {url}</div>
  ),
}));

vi.mock("./pages/List/List", () => ({
  default: ({ url }) => (
    <div data-testid="list-mock"> List Component with URL: {url}</div>
  ),
}));

vi.mock("./pages/Orders/Orders", () => ({
  default: ({ url }) => (
    <div data-testid="orders-mock"> Orders Component with URL: {url}</div>
  ),
}));

vi.stubEnv("VITE_API_URL", "http://localhost:4000");

vi.mock("react-toastify", () => ({
  ToastContainer: (props) => (
    <div data-testid="toast-container-mock" data-props={JSON.stringify(props)}>
      Toast Container
    </div>
  ),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("App component", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });

  it("renders navbar component", () => {
    expect(screen.getByTestId("navbar-mock")).toBeInTheDocument();
  });
  it("renders sidebar component", () => {
    expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
  });
  it("renders toast container component", () => {
    expect(screen.getByTestId("toast-container-mock")).toBeInTheDocument();
  });
  it("renders horizontal rule", () => {
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});

describe("App component routing", () => {
  const renderWithRoute = (route) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    );
  };

  it("renders Add component on /add route", () => {
    renderWithRoute("/add");

    expect(screen.getByTestId("add-mock")).toBeInTheDocument();
  });

  it("renders List component on /list route", () => {
    renderWithRoute("/list");
    expect(screen.getByTestId("list-mock")).toBeInTheDocument();
  });

  it("renders Orders component on /orders route", () => {
    renderWithRoute("/orders");
    expect(screen.getByTestId("orders-mock")).toBeInTheDocument();
  });
});

describe("Props passing", () => {


  const renderWithRouteAndAssert = (route, testId, expectedText) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId(testId)).toHaveTextContent(expectedText);
  }

  it("passes the correct API URL to add component", () => {
    renderWithRouteAndAssert(
      "/add",
      "add-mock",
      "Add Component with URL: http://localhost:4000"
    );
  });

  it("passes the correct API URL to list component", () => {
    renderWithRouteAndAssert(
      "/list",
      "list-mock",
      "List Component with URL: http://localhost:4000"
    );
  });

  it("passes the correct API URL to orders component", () => {
    renderWithRouteAndAssert(
      "/orders",
      "orders-mock",
      "Orders Component with URL: http://localhost:4000"
    );
  });
});

describe("Toast container", () => {
  it("configures ToastContainer with correct props", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const toastContainer = screen.getByTestId("toast-container-mock");
    const props = JSON.parse(toastContainer.getAttribute("data-props"));

    expect(props.position).toBe("top-right");
    expect(props.autoClose).toBe(5000);
    expect(props.hideProgressBar).toBe(false);
    expect(props.newestOnTop).toBe(false);
    expect(props.closeOnClick).toBe(true);
    expect(props.rtl).toBe(false);
    expect(props.pauseOnFocusLoss).toBe(true);
    expect(props.draggable).toBe(true);
    expect(props.pauseOnHover).toBe(true);
    expect(props.theme).toBe("light");
  });
});

