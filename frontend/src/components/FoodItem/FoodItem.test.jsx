import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import FoodItem from "./FoodItem";
import { MemoryRouter } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const renderFoodItem = (props, storeContextValue) => {
  render(
    <MemoryRouter>
      <StoreContext.Provider value={storeContextValue}>
        <FoodItem {...props} />
      </StoreContext.Provider>
    </MemoryRouter>
  );
};

const mockStoreContext = {
  cartItems: {},
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
};
const mockProps = {
  id: 1,
  name: "Pizza",
  price: 12.99,
  description: "Delicious cheese pizza",
  image: "pizza.jpg",
};

describe("FoodItem Component", () => {
  
  it("verifying if the food items are displaying correctly", () => {
    renderFoodItem(mockProps, mockStoreContext);
    const foodItemName = screen.getByText(mockProps.name);
    const foodItemPrice = screen.getByText(`$${mockProps.price}`);
    const foodItemDesc = screen.getByText(mockProps.description);
    const foodItemImg = screen.getByAltText("");

    expect(foodItemName).toBeVisible();
    expect(foodItemPrice).toBeVisible();
    expect(foodItemDesc).toBeVisible();
    expect(foodItemImg).toBeVisible();
  });

  it("verifying if the first 'add-to-cart' button is working", () => {
    renderFoodItem(mockProps, mockStoreContext);
    const firstAddToCart = screen.getByAltText("add-icon");
    fireEvent.click(firstAddToCart);
    expect(mockStoreContext.addToCart).toHaveBeenCalledWith(mockProps.id);
  });

  it("testing that the counter is displayed when the item is in the cart", () => {
    mockStoreContext.cartItems[mockProps.id] = 1;
    renderFoodItem(mockProps, mockStoreContext);
    const counter = screen.getByText("1");
    expect(counter).toBeVisible();
  });

  it("verifying if the 'add-item' button from the counter is working", () => {
    mockStoreContext.cartItems[mockProps.id] = 1;
    renderFoodItem(mockProps, mockStoreContext);
    const addItemButton = screen.getByAltText("add-item");
    fireEvent.click(addItemButton);
    expect(mockStoreContext.addToCart).toHaveBeenCalledWith(mockProps.id);
  });

  it("verifying if the 'remove-item' button from the counter is working", () => {
    mockStoreContext.cartItems[mockProps.id] = 1;
    renderFoodItem(mockProps, mockStoreContext);
    const removeItemButton = screen.getByAltText("remove-item");
    fireEvent.click(removeItemButton);
    expect(mockStoreContext.removeFromCart).toHaveBeenCalledWith(mockProps.id);
  }) 
});
