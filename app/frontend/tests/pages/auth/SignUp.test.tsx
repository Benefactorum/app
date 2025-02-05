import { describe, it, expect, vi, beforeEach } from 'vitest'
import { router } from '@inertiajs/react'
import { render, screen } from '@testing-library/react'
import SignUp from '@/pages/Auth/SignUp'

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

vi.mock('@/components/pages/auth/signUp/SignUpForm', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid='sign-up-form' />)
}))

describe('SignUp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
  })

  it('navigates back if no email is found', () => {
    window.sessionStorage.setItem('email', '')
    render(<SignUp />)
    expect(router.get).toHaveBeenCalledWith('/connexion')
  })

  it('renders correctly with an email', () => {
    const mockEmail = 'test@example.com'
    window.sessionStorage.setItem('email', mockEmail)
    render(<SignUp />)
    expect(screen.getByText(mockEmail)).toBeInTheDocument()
  })

  it('renders the SignUpForm with the correct email prop', () => {
    render(<SignUp />)
    const signUpForm = screen.getByTestId('sign-up-form')
    // const signUpForm = screen.getByRole('form')
    expect(signUpForm).toBeInTheDocument()
  })

  it('renders the quote section', () => {
    render(<SignUp />)
    expect(
      screen.getByText(
        'Avec Benefactorum, je suis hyper content !'
      )
    ).toBeInTheDocument()
  })
})
