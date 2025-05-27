import {describe, it, expect, beforeEach} from "vitest";
import {render, screen} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import Siderbar from "./Siderbar";
import "@testing-library/jest-dom";
import {assets} from "../../assets/assets";

vi.mock('../../assets/assets', () => ({
    assets: {
        add_icon: '/mock-path/add_icon.png',
        list_icon: '/mock-path/order_icon.png',
        order_icon: '/mock-path/order_icon.png'
    }
}));

describe ("Sidebar component", () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <Siderbar />
            </BrowserRouter>
        );
    });


it("renders sidebar component", () => {
    const sidebarElement = screen.getByTestId("mock-sidebar");
    expect(sidebarElement).toBeInTheDocument();
    expect(sidebarElement).toHaveClass('sidebar');
});

it("displays nav links", () => {
    const addItemsLink = screen.getByText(/Add Items/i);
    const listItemsLink = screen.getByText(/List Items/i);
    const ordersLink = screen.getByText(/Orders/i);

    expect(addItemsLink).toBeInTheDocument();
    expect(listItemsLink).toBeInTheDocument();
    expect(ordersLink).toBeInTheDocument();
});

it("sidebar has correct nav paths", () => {
    const addItemsLink = screen.getByText(/Add Items/i);
    const listItemsLink = screen.getByText(/List Items/i);
    const ordersLink = screen.getByText(/Orders/i);

    expect(addItemsLink.closest('a')).toHaveAttribute('href', '/add');
    expect(listItemsLink.closest('a')).toHaveAttribute('href', '/list');
    expect(ordersLink.closest('a')).toHaveAttribute('href', '/orders');
});

});

describe("Snapshot testing", () => {
    it("matches the snapshot", () => {
        const {container} = render(
            <BrowserRouter>
                <Siderbar />
            </BrowserRouter>
        );
        expect(container).toMatchSnapshot();
    })
})