import { render, screen, fireEvent } from "@testing-library/react";
import { ConnectionForm } from "@/pages/Auth/ConnectionForm";
import { useConnectionForm } from "@/hooks/useConnectionForm";

vi.mock("@/hooks/useConnectionForm");

describe("ConnectionForm", () => {
  it("displays error message if errors.email is present", () => {
    (useConnectionForm as jest.Mock).mockReturnValueOnce({
      data: { email: "" },
      errors: { email: "Invalid email" },
      processing: false,
      updateEmail: vi.fn(),
      validateAndSubmit: vi.fn(),
    });

    render(<ConnectionForm />);
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });
});
