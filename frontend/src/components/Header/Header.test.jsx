import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import Header from "./Header";
import { MemoryRouter} from "react-router-dom";


const renderHeader = () => {
    render(
        <MemoryRouter>
            <Header />
        </MemoryRouter>
    );
}

describe("Header Component", () => {

    it ("renders the header text", () => {
    renderHeader();
    const headerText = screen.getByTestId("header-text");
    expect(headerText).toBeVisible();
    });

    it("scrolls to menu section when 'View Menu' button is clicked", () => {
       const scrollToMenuSpy = vi.spyOn(document, "getElementById").mockReturnValue({scrollIntoView: vi.fn()});

       renderHeader();

       const viewMenuButton = screen.getByTestId("view-menu");
       fireEvent.click(viewMenuButton);
       expect(scrollToMenuSpy).toHaveBeenCalledWith("explore-menu");
       scrollToMenuSpy.mockRestore();
    });

})