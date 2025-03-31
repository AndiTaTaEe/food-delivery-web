import React from "react";
import { render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect} from "vitest";
import FoodDisplay from "./FoodDisplay";
import { MemoryRouter } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";


const renderFoodDisplay = (category, StoreContextValue) => {
    render(
        <MemoryRouter>
            <StoreContext.Provider value={StoreContextValue}>
                <FoodDisplay category={category} />
            </StoreContext.Provider>
        </MemoryRouter>
    );
};

const mockStoreContext = {
    food_list : [
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
    cartItems: {}
  };

      
  const mockProps = {
    category: "Italian",
    foodList: mockStoreContext.food_list,
  };

describe("FoodDisplay Component", () => {
  it("verifying if the food items are displaying correctly", () => {


    renderFoodDisplay(mockProps.category, mockStoreContext);

    expect(screen.getByText(mockStoreContext.food_list[0].name)).toBeVisible();
    expect(screen.getByText(mockStoreContext.food_list[2].name)).toBeVisible();

    expect(screen.queryByText(mockStoreContext.food_list[1].name)).not.toBeInTheDocument(); 
});

 it("verifying if the FoodItem component is rendered for each food item in the filtered list", () => {
    renderFoodDisplay(mockProps.category, mockStoreContext);

    const filteredFoodList = mockStoreContext.food_list.filter((item) => item.category === mockProps.category);

    filteredFoodList.forEach((foodItem) => {
        expect(screen.getByText(foodItem.name)).toBeVisible();
    });

 });

});
