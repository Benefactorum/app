import { render, screen } from "@testing-library/react";
import { InputError } from "@/components/InputError";

describe("InputError", () => {
  it("renders the error message", () => {
    render(<InputError>Some error text</InputError>);
    expect(screen.getByText("Some error text")).toBeInTheDocument();
  });
});
