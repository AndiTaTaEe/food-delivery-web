import React from "react";
import { render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter} from "react-router-dom";
import App from "./App";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import { expect } from "chai";
import { describe, it, vi } from "vitest";
import { StoreContext } from "./context/StoreContext";

const mockStoreContext = {
    food_list: [],
    cartItems: {},
    addToCart: vi.fn(),
    removeFromCart: vi.fn()
}

const renderApp = (path) => {
    render(
        <StoreContext.Provider value={mockStoreContext}>
            <MemoryRouter initialEntries={[path]}>
                <App/>
            </MemoryRouter>
        </StoreContext.Provider>
    );
}

describe ("App Component Routing", () => {
    it("renders the Home Component by default", () => {
        renderApp("/");

        expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });

    it("renders the Cart Component when the path is /cart", () => {
        renderApp("/cart");

        expect(screen.getByTestId("cart-page")).toBeInTheDocument();
    });

    it("renders the PlaceOrder Component when the path is /order", () => {
        renderApp("/order");
        expect(screen.getByTestId("order-page")).toBeInTheDocument();
});

});