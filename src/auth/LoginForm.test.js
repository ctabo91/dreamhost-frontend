import React from "react";
import { render } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { MemoryRouter } from "react-router";

it("renders without crashing", () => {
    render(
        <MemoryRouter>
            <LoginForm />
        </MemoryRouter>
    );
});

it("matches snapshot", () => {
    const { asFragment } = render(
        <MemoryRouter>
            <LoginForm />
        </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
});