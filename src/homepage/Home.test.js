import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Home from "./Home";
import { UserProvider } from "../testUtils";

describe("Home Component", () => {
    it("renders without crashing", () => {
        render(
            <MemoryRouter>
                <UserProvider>
                    <Home />
                </UserProvider>
            </MemoryRouter>,
        );
    });
    
    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <UserProvider>
                    <Home />
                </UserProvider>
            </MemoryRouter>,
        );
        expect(asFragment()).toMatchSnapshot();
    });
    
    it("matches snapshot when logged out", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <UserProvider currentUser={null}>
                    <Home />
                </UserProvider>
            </MemoryRouter>,
        );
        expect(asFragment()).toMatchSnapshot();
    });
    
    it("shows correct welcome message when logged in", () => {
        render(
            <MemoryRouter>
                <UserProvider>
                    <Home />
                </UserProvider>
            </MemoryRouter>,
        );
    
        expect(screen.getByText('Welcome testfirst!')).toBeInTheDocument();
    });
    
    it("shows correct welcome message when not logged in", () => {
        render(
            <MemoryRouter>
                <UserProvider currentUser={null}>
                    <Home />
                </UserProvider>
            </MemoryRouter>,
        );
    
        expect(screen.getByText('DreamHost')).toBeInTheDocument();
    });
});