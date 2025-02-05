import { describe, it, expect, vi, beforeEach } from 'vitest'
import { router } from '@inertiajs/react'
import { render, screen } from '@testing-library/react'
import SignIn from '@/pages/Auth/SignIn'

vi.mock('@inertiajs/react', async () => {
  const actual = await vi.importActual('@inertiajs/react')
  return {
    ...actual,
    usePage: () => ({
      props: {
      // Mock your page props here
      }
    }),
    Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    router: {
      get: vi.fn()
    }
  }
})

vi.mock('@/components/pages/auth/signIn/SignInForm', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid='sign-in-form' />)
}))

describe('SignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
  })

  it('navigates back if no email is found', () => {
    window.sessionStorage.setItem('email', '')
    render(<SignIn />)
    expect(router.get).toHaveBeenCalledWith('/connexion')
  })

  it('renders correctly with an email', () => {
    const mockEmail = 'test@example.com'
    window.sessionStorage.setItem('email', mockEmail)
    render(<SignIn />)
    expect(screen.getByText(mockEmail)).toBeInTheDocument()
  })

  it('renders the SignInForm with the correct email prop', () => {
    render(<SignIn />)
    const signInForm = screen.getByTestId('sign-in-form')
    expect(signInForm).toBeInTheDocument()
  })

  it('renders the quote section', () => {
    render(<SignIn />)
    expect(
      screen.getByText(
        "Tout est question d'espoir, de gentillesse et de connexion les uns avec les autres."
      )
    ).toBeInTheDocument()
    expect(screen.getByText('Elizabeth Taylor')).toBeInTheDocument()
  })
})
