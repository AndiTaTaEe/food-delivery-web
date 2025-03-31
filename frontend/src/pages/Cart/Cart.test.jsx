import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import Cart from "./Cart";
import { MemoryRouter } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const renderCart = (storeContextValue) => {
  render(
    <MemoryRouter>
      <StoreContext.Provider value={storeContextValue}>
        <Cart />
      </StoreContext.Provider>
    </MemoryRouter>
  );
};

const mockStoreContext = {
  cartItems: {
    1: 2,
    2: 0,
    3: 1,
  },

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
    },
    {
      _id: 3,
      name: "Pasta",
      category: "Italian",
      description: "Creamy Alfredo pasta",
      price: 14.99,
      image: "pasta.jpg",
    },
  ],
  removeFromCart: vi.fn(),
};

const getCartItemContainer = (foodItem, cartItems) => {
    return cartItems[foodItem._id]> 0 ? screen.getByTestId(`cart-item-${foodItem._id}`) : null;
}

describe("Cart Page", () => {
  it("verifying if the cart items are displayed correctly with all of the details", () => {
    renderCart(mockStoreContext);
    mockStoreContext.food_list.forEach((foodItem) => {
      const cartItemContainer = getCartItemContainer(foodItem, mockStoreContext.cartItems);
      if (cartItemContainer) {
        const cartFoodName = within(cartItemContainer).getByText(foodItem.name);
        const cartFoodPrice = within(cartItemContainer).getByTestId(
          `cart-item-price-${foodItem._id}`
        );
        const cartFoodQty = within(cartItemContainer).getByTestId(
          `cart-item-qty-${foodItem._id}`
        );
        const cartFoodTotal = within(cartItemContainer).getByTestId(
          `cart-item-total-${foodItem._id}`
        );
        expect(cartFoodName).toBeVisible();
        expect(cartFoodPrice).toBeVisible();
        expect(cartFoodQty).toBeVisible();
        expect(cartFoodTotal).toBeVisible();
      } else {
        expect(cartItemContainer).not.toBeInTheDocument();
      }
    });
  });

  it("verifying if the remove button is calling the removeFromCart function", () => {
    renderCart(mockStoreContext);

    mockStoreContext.food_list.forEach((foodItem) => {
     const cartItemContainer = getCartItemContainer(foodItem, mockStoreContext.cartItems);
     if(cartItemContainer) {
      const removeButton = within(cartItemContainer).getByTestId(
        `cart-item-remove-${foodItem._id}`
      );

      fireEvent.click(removeButton);
      expect(mockStoreContext.removeFromCart).toHaveBeenCalledWith(
        foodItem._id
      );
    }
    else {
        expect(cartItemContainer).not.toBeInTheDocument();
    }
    });
  });

  it("testing if the cart only displays items with quantity greater than 0", () => {
    renderCart(mockStoreContext);
    mockStoreContext.food_list.forEach((foodItem) => {
      const cartItemContainer = screen.queryByTestId(
        `cart-item-${foodItem._id}`
      );

      if (mockStoreContext.cartItems[foodItem._id] > 0) {
        expect(cartItemContainer).toBeVisible();
      } else {
        expect(cartItemContainer).not.toBeInTheDocument();
      }
    });
  });
});
