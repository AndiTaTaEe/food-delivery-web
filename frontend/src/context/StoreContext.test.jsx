import React from "react";
import { render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi} from "vitest";
import { StoreContext } from "./StoreContext";

  const mockStoreContext = {
        cartItems: {
            1:1
        },

        addToCart: vi.fn((id) => {
            if (mockStoreContext.cartItems[id]) {
                mockStoreContext.cartItems[id] += 1;
            } else {
                mockStoreContext.cartItems[id] = 1;
            }
        }),
        removeFromCart: vi.fn((id) => {
            if (mockStoreContext.cartItems[id]) {
                mockStoreContext.cartItems[id] -= 1;
                if (mockStoreContext.cartItems[id] <= 0) {
                    delete mockStoreContext.cartItems[id];
                }
            }
        }),
    };


describe("StoreContext", () => {
    
    it("verifying if the cartItems state is updated correctly when added or removed", () => {
        render (
            <StoreContext.Provider value={mockStoreContext}>
                <button onClick={() => mockStoreContext.addToCart(1)}>Add to Cart ID1</button>
                <button onClick = {() => mockStoreContext.addToCart(2)}>Add to Cart ID2</button>
                <button onClick={() => mockStoreContext.removeFromCart(1)}>Remove from Cart ID1</button>
                <button onClick = {() => mockStoreContext.removeFromCart(2)}>Remove from Cart ID2</button>
            </StoreContext.Provider>
        );

      screen.getByText("Add to Cart ID1").click();
      expect(mockStoreContext.cartItems[1]).toBe(2);

      screen.getByText("Add to Cart ID2").click();
      expect(mockStoreContext.cartItems[2]).toBe(1);

      screen.getByText("Remove from Cart ID1").click();
      expect(mockStoreContext.cartItems[1]).toBe(1);
      screen.getByText("Remove from Cart ID1").click();
      expect(mockStoreContext.cartItems[1]).toBeUndefined();

      

      screen.getByText("Remove from Cart ID2").click();
      expect(mockStoreContext.cartItems[2]).toBeUndefined();

      screen.getByText("Add to Cart ID2").click();
      screen.getByText("Add to Cart ID2").click();
      expect(mockStoreContext.cartItems[2]).toBe(2);
    })
})