import React from "react";
import { render } from "@testing-library/react";
import Profile from "./Profile";
import { UserProvider } from "../testUtils";
import { MemoryRouter } from "react-router-dom";

it("renders without crashing", function () {
    render(
        <MemoryRouter>
            <UserProvider>
                <Profile />
            </UserProvider>
        </MemoryRouter>
    );
});

it("matches snapshot", function () {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <Profile />
            </UserProvider>
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
});
