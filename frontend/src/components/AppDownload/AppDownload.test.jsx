import React from "react";
import { render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect} from "vitest";
import { MemoryRouter } from "react-router-dom";
import AppDownload from "./AppDownload";

const renderAppDownload = () => {
    render(
        <MemoryRouter>
            <AppDownload />
        </MemoryRouter>
    );
};

describe("AppDownload Component", () => {
    it("verifying if the 'tomato-app' text is displaying correctly", () => {
        renderAppDownload();
        const appDownloadText = screen.getByText(/tomato app/i);
        expect(appDownloadText).toBeVisible();
});

    it("verifying if the app store images are rendered", () => {
        renderAppDownload();
        const playStoreImage = screen.getByAltText(/play-store/i);
        expect(playStoreImage).toBeVisible();
        const appStoreImage = screen.getByAltText(/app-store/i);
        expect(appStoreImage).toBeVisible();
    })
});

