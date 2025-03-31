import React from "react";
import { render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect} from "vitest";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

const renderFooter = () => {
    render (
        <MemoryRouter>
            <Footer />
        </MemoryRouter>
    );
};

describe("Footer Component", () => {
    it("Verifying if the footer sections are displayed correctly", () => {
        renderFooter();
        const footerCompanySection = screen.getByTestId("company");
        expect(footerCompanySection).toBeVisible();
        const footerContactSection = screen.getByTestId("contact-us");
        expect(footerContactSection).toBeVisible();
});

    it("verifying if the social media icons are displayed correctly", () => {
        renderFooter();
        const facebookIcon = screen.getByAltText(/facebook-icon/i);
        expect(facebookIcon).toBeVisible();
        const twitterIcon = screen.getByAltText(/twitter-icon/i);
        expect(twitterIcon).toBeVisible();
        const linkedinIcon = screen.getByAltText(/linkedin-icon/i);
        expect(linkedinIcon).toBeVisible();
    });

    it("testing if the copyright text is displayed correctly", () => {
        renderFooter();
        const copyrightText = screen.getByTestId("copyright");
        expect(copyrightText).toBeVisible();
    });
});