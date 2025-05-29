import React from "react";
import { fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi} from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import { StoreContext } from "../../context/StoreContext";

const mockStoreContext = {
    cartItems: {},
    food_list: [],
    url: "http://localhost:4000",
    getTotalCartAmmount: vi.fn(() => 0),
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
};

const renderLoginPopup = (setShowLogin) => {
    render(
        <StoreContext.Provider value={mockStoreContext}>
        <MemoryRouter>
            <LoginPopup setShowLogin={setShowLogin} />
        </MemoryRouter>
        </StoreContext.Provider>
    );
};

describe("LoginPopup Component", () => {
    const mockSetShowLogin = vi.fn();
    it("verifying if the popup displays the correct title based on the state", () => {
        renderLoginPopup(mockSetShowLogin);
        const loginTitle = screen.getByTestId("login-popup-title");
        expect(loginTitle).toHaveTextContent("Login");
        
        const changeToSignUp = screen.getByTestId("sign-up");
        fireEvent.click(changeToSignUp);
        expect(loginTitle).toHaveTextContent("Sign Up");
    });

    it("verifying if the 'Click here' and 'Login here' links work correctly", () => {
        renderLoginPopup(mockSetShowLogin);
        const changeToSignUp = screen.getByTestId("sign-up");
        fireEvent.click(changeToSignUp);

        const changeToLogin = screen.getByTestId("login");
        fireEvent.click(changeToLogin);

        expect(mockSetShowLogin).not.toHaveBeenCalled(); 
    });

    it("testing if the close button calls the setShowLogin with false", () => {
        renderLoginPopup(mockSetShowLogin);
        const closeButton = screen.getByAltText("close-button");
        fireEvent.click(closeButton);
        expect(mockSetShowLogin).toHaveBeenCalledWith(false);
    })
})