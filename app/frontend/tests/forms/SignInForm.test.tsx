import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SignInForm from '@/components/forms/SignInForm'
import { useFormHandler } from '@/hooks/useFormHandler'

vi.mock('@inertiajs/react', async () => {
  const actual = await vi.importActual('@inertiajs/react')
  return {
    ...actual,
    router: {
      get: vi.fn(),
      post: vi.fn()
    }
  }
})

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn()
  }
}))

vi.mock('@/hooks/useFormHandler', () => ({
  useFormHandler: vi.fn(() => ({
    data: {
      email: 'test@example.com',
      code: ''
    },
    updateField: vi.fn(),
    submit: vi.fn((e: Event) => e.preventDefault()),
    processing: false,
    errors: {}
  }))
}))

describe('SignInForm', () => {
  let mockedUpdateField: Mock
  let mockedSubmit: Mock

  beforeEach(() => {
    const useFormHandlerMock = vi.mocked(useFormHandler)
    mockedUpdateField = vi.fn()
    mockedSubmit = vi.fn((e) => e.preventDefault())

    useFormHandlerMock.mockReturnValue({
      data: {
        email: 'test@example.com',
        code: ''
      },
      updateField: mockedUpdateField,
      submit: mockedSubmit,
      processing: false,
      errors: {}
    })

    vi.clearAllMocks()
  })

  it('renders the OTP input and submit button', () => {
    render(<SignInForm email='place@hold.er' />)

    const inputOTP = screen.getByRole('textbox')
    expect(inputOTP).toBeInTheDocument()

    const button = screen.getByRole('button', { name: /Continuer/i })
    expect(button).toBeInTheDocument()
  })

  it('calls updateField on OTP input change', () => {
    render(<SignInForm email='place@hold.er' />)
    const slots = screen.getAllByRole('textbox')
    fireEvent.change(slots[0], { target: { value: '1' } })
    expect(mockedUpdateField).toHaveBeenCalledWith('code', '1')
  })

  it('submits the form when "Continuer" is clicked', () => {
    const { container } = render(<SignInForm email='place@hold.er' />)
    const form = container.querySelector('form')
    expect(form).not.toBeNull()
    if (form === null) throw new Error('Form not found')
    fireEvent.submit(form)
    expect(mockedSubmit).toHaveBeenCalled()
  })

  it('disables the button if processing or there is an error', () => {
    const useFormHandlerMock = vi.mocked(useFormHandler)
    useFormHandlerMock.mockReturnValueOnce({
      data: {
        email: 'test@example.com',
        code: ''
      },
      updateField: mockedUpdateField,
      submit: mockedSubmit,
      processing: true,
      errors: {}
    })

    render(<SignInForm email='place@hold.er' />)
    const button = screen.getByRole('button', { name: /Continuer/i })
    expect(button).toBeDisabled()
  })
})
