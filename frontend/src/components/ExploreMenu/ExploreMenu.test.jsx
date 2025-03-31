import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import ExploreMenu from "./ExploreMenu";
import { menu_list } from "../../assets/assets";
import { MemoryRouter } from "react-router-dom";

const renderExploreMenu = (category, setCategory) => {
  render(
    <MemoryRouter>
      <ExploreMenu category={category} setCategory={setCategory} />
    </MemoryRouter>
  );
};

const getMenuCategories = () => screen.getAllByTestId("menu-categories");

describe("ExploreMenu Component", () => {
  const mockSetCategory = vi.fn();

  it("renders the correct number of menu lists", () => {
    renderExploreMenu("All", mockSetCategory);
    const menuCategories = getMenuCategories();
    expect(menuCategories).toHaveLength(menu_list.length);
  });

  it("render the menu_list images correctly", () => {
    renderExploreMenu("All", mockSetCategory);
    const menuImage = screen.getAllByTestId("menu-image");

    menu_list.forEach((item, index) => {
      expect(menuImage[index]).toHaveAttribute("src", item.menu_image);
      expect(menuImage[index]).toHaveAttribute("alt", item.menu_name);
    });
  });

  it("updating setCategory state when clicking on menu_list", () => {
    renderExploreMenu("All", mockSetCategory);

    const menuCategories = getMenuCategories();

    menuCategories.forEach((item, index) => {
      fireEvent.click(item);

      // verifica daca mockSetCategory a fost apelat
      expect(mockSetCategory).toHaveBeenCalledWith(expect.any(Function));

      // verifica daca categoria a fost actualizata corect
      const mockPrevCategory = "All";
      const updatedCategory =
        mockPrevCategory === menu_list[index].menu_name
          ? "All"
          : menu_list[index].menu_name;

      // verifica daca functia mockSetCategory a fost apelata cu categoria corecta
      const setCategoryFunction = mockSetCategory.mock.calls[index][0];
      expect(setCategoryFunction(mockPrevCategory)).toBe(updatedCategory);
    });
  });

  it("testing if active class is applied correctly when clicking on a category", () => {
    
    const TestComponent = () => {
        const [category, setCategory] = React.useState("All");
        return <ExploreMenu category={category} setCategory={setCategory} />;
    };

    render (
        <MemoryRouter>
            <TestComponent />
        </MemoryRouter>
    );

    const menuCategories = getMenuCategories();

    menuCategories.forEach((item, index) => {
      fireEvent.click(item);

      const menuImage = screen.getAllByTestId("menu-image")[index];
      expect(menuImage).toHaveClass("active");

      menuCategories.forEach((otherItem, otherIndex) => {
        if (otherIndex !== index) {
          const otherMenuImage =
            screen.getAllByTestId("menu-image")[otherIndex];
          expect(otherMenuImage).not.toHaveClass("active");
        }
      });
    });
  });
});
