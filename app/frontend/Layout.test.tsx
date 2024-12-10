import { render, screen } from "@testing-library/react"
import Layout from "@/Layout"

// Mock matchMedia globally for consistent behavior in tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vitest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vitest.fn(), // Deprecated
    removeListener: vitest.fn(), // Deprecated
    addEventListener: vitest.fn(),
    removeEventListener: vitest.fn(),
    dispatchEvent: vitest.fn(),
  })),
})

// Error: usePage must be used within the Inertia component
vi.mock("@/components/layout/Header", () => ({
  default: () => <div>Mock Header</div>,
}))

vi.mock("@/components/AppSidebar", () => ({
  AppSidebar: () => <div>Mock App Sidebar</div>,
}))

describe("Layout Component", () => {
  const renderLayout = (showSidebar) => {
    render(
      <Layout showSidebar={showSidebar}>
        <div>Test Content</div>
      </Layout>
    )
  }

  it("renders the sidebar when showSidebar is true", () => {
    renderLayout(true)

    expect(screen.getByText("Mock App Sidebar")).toBeInTheDocument()
  })

  it("does not render the sidebar when showSidebar is false", () => {
    renderLayout(false)

    expect(screen.queryByText("Mock App Sidebar")).not.toBeInTheDocument()
  })
})
