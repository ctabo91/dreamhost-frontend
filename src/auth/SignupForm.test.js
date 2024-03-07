import React from "react";
import { render } from "@testing-library/react";
import SignupForm from "./SignupForm";
import { MemoryRouter } from "react-router";

it("renders without crashing", () => {
    render(
        <MemoryRouter>
            <SignupForm />
        </MemoryRouter>
    );
});

it("matches snapshot",  () => {
    const { asFragment } = render(
        <MemoryRouter>
            <SignupForm />
        </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
});