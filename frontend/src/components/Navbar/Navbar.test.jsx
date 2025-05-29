import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import Navbar from "./Navbar";
import { MemoryRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { StoreContext } from "../../context/StoreContext";

const renderNavbar = (setShowLogin) => {
  render(
    <StoreContext.Provider value={mockStoreContext}>
    <MemoryRouter>
      <Navbar setShowLogin={setShowLogin} />
    </MemoryRouter>
    </StoreContext.Provider>
  );
};

const getNavLinks = () => ({
  homeLink: screen.getByTestId("home"),
  menuLink : screen.getByTestId("menu"),
  mobileAppLink : screen.getByTestId("mobile-app"),
  contactUsLink : screen.getByTestId("contact-us"),
}); //functie pentru returnarea linkurilor din navbar

const getBasketIcon = () => screen.getByAltText("basket-icon");

const mockStoreContext = {
  cartItems: {
    1: 2,
    2: 0,
    3: 1,},
  food_list: [
    {
      _id: 1,
      name: "Pizza",
      category: "Italian",
      description: "Delicious cheese pizza",
      price: 12.99,
      image: "pizza.jpg",
    },
    {
      _id: 2,
      name: "Burger",
      category: "American",
      description: "Juicy beef burger",
      price: 10.99,
      image: "burger.jpg",
    }
  ],
  removeFromCart: vi.fn(),
  getTotalCartAmmount: vi.fn(() => 42)
};



describe("Navbar Component", () => {
  const mockSetShowLogin = vi.fn(); 

  it("renders the logo", () => {
   renderNavbar(mockSetShowLogin);
    const logo = screen.getByAltText("company-logo"); 
    expect(logo).toBeVisible();
  });

  it("renders nav links", () => {
    renderNavbar(mockSetShowLogin);
    const {homeLink, menuLink, mobileAppLink, contactUsLink} = getNavLinks();
    expect(homeLink).toBeVisible();
    expect(menuLink).toBeVisible();
    expect(mobileAppLink).toBeVisible();
    expect(contactUsLink).toBeVisible();

  });

  it("activates nav links on click", () => {
    renderNavbar(mockSetShowLogin);
    const {homeLink, menuLink, mobileAppLink, contactUsLink} = getNavLinks();

    fireEvent.click(menuLink);
    expect(menuLink).toHaveClass("active");

    fireEvent.click(homeLink);
    expect(homeLink).toHaveClass("active");

    fireEvent.click(mobileAppLink);
    expect(mobileAppLink).toHaveClass("active");

    fireEvent.click(contactUsLink);
    expect(contactUsLink).toHaveClass("active");

  });

  it("calls setShowLogin after clicking the sign-in button" ,() => {
    renderNavbar(mockSetShowLogin);
    const signInButton = screen.getByTestId("sign-in");
    fireEvent.click(signInButton);
    expect(mockSetShowLogin).toHaveBeenCalledWith(true);
  });

  it("renders the basket icon" ,() => {
    renderNavbar(mockSetShowLogin);
    const basketIcon = getBasketIcon();
    expect(basketIcon).toBeVisible();
  });

  it("navigates to /cart when basket-icon is clicked", () => {
    const history = createMemoryHistory({initialEntries: ["/"]});

    render (
      <StoreContext.Provider value={mockStoreContext}>
      <Router location={history.location} navigator={history}>
        <Navbar setShowLogin={mockSetShowLogin} />
      </Router>
      </StoreContext.Provider>
    );

    const basketIcon = getBasketIcon();
    fireEvent.click(basketIcon);
    expect(history.location.pathname).toBe("/cart");

    });
  
  });



