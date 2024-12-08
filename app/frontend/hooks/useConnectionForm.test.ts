import { renderHook, act } from "@testing-library/react";
import { useConnectionForm } from "@/hooks/useConnectionForm";
import { useForm } from "@inertiajs/react";

// Mocking useForm from Inertia
vi.mock("@inertiajs/react", () => {
  return {
    useForm: vi.fn(),
  };
});

describe("useConnectionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with email from sessionStorage if available", () => {
    sessionStorage.setItem("email", "test@example.com");
    (useForm as jest.Mock).mockReturnValue({
      data: { email: "test@example.com" },
      setData: vi.fn(),
      post: vi.fn(),
      processing: false,
      errors: {},
      setError: vi.fn(),
      clearErrors: vi.fn(),
    });
    const { result } = renderHook(() => useConnectionForm());
    expect(result.current.data.email).toBe("test@example.com");
  });

  it("updates email and clears errors when updateEmail is called", () => {
    const setDataMock = vi.fn();
    const clearErrorsMock = vi.fn();
    (useForm as jest.Mock).mockReturnValue({
      data: { email: "" },
      setData: setDataMock,
      post: vi.fn(),
      processing: false,
      errors: {},
      setError: vi.fn(),
      clearErrors: clearErrorsMock,
    });

    const { result } = renderHook(() => useConnectionForm());
    act(() => {
      result.current.updateEmail("new@example.com");
    });

    expect(setDataMock).toHaveBeenCalledWith("email", "new@example.com");
    expect(clearErrorsMock).toHaveBeenCalledWith("email");
  });

  it("sets error if email is invalid on submit", () => {
    const setErrorMock = vi.fn();
    (useForm as jest.Mock).mockReturnValue({
      data: { email: "invalid-email" },
      setData: vi.fn(),
      post: vi.fn(),
      processing: false,
      errors: {},
      setError: setErrorMock,
      clearErrors: vi.fn(),
    });

    const { result } = renderHook(() => useConnectionForm());
    const fakeEvent = { preventDefault: vi.fn() } as any;
    act(() => {
      result.current.validateAndSubmit(fakeEvent);
    });

    expect(setErrorMock).toHaveBeenCalledWith("email", expect.stringContaining("valide"));
  });

  it("calls post if email is valid and sets sessionStorage on success", () => {
  const postMock = vi.fn();
  (useForm as jest.Mock).mockReturnValue({
    data: { email: "valid@example.com" },
    setData: vi.fn(),
    post: postMock,
    processing: false,
    errors: {},
    setError: vi.fn(),
    clearErrors: vi.fn(),
  });

  const { result } = renderHook(() => useConnectionForm());

  // Mock the post call to simulate onSuccess callback
  postMock.mockImplementation((url, { onSuccess }) => {
    onSuccess({ url: "/some-other-page" });
  });

  const fakeEvent = { preventDefault: vi.fn() } as any;

  act(() => {
    result.current.validateAndSubmit(fakeEvent);
  });

  expect(postMock).toHaveBeenCalledWith("/connections", expect.any(Object));
  expect(sessionStorage.getItem("email")).toBe("valid@example.com");
  expect(sessionStorage.getItem("firstName")).toBe(null);
  expect(sessionStorage.getItem("lastName")).toBe(null);
  expect(sessionStorage.getItem("signUpBlocked")).toBe(null);
  expect(sessionStorage.getItem("acceptsConditions")).toBe(null);
});
});
