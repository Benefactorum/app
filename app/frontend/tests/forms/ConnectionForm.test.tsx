import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ConnectionForm from '@/components/forms/ConnectionForm'
import useFormHandler from '@/hooks/useFormHandler'

// Mock useFormHandler hook
vi.mock('@/hooks/useFormHandler', () => ({
  default: vi.fn(() => ({
    data: { email: '' },
    updateField: vi.fn(),
    submit: vi.fn((e: Event) => e.preventDefault()),
    processing: false,
    errors: {}
  }))
}))

describe('ConnectionForm', () => {
  let mockUpdateField: Mock
  let mockSubmit: Mock

  beforeEach(() => {
    const mockedUseFormHandler = vi.mocked(useFormHandler)
    mockUpdateField = vi.fn()
    mockSubmit = vi.fn((e: Event) => e.preventDefault())
    mockedUseFormHandler.mockReturnValue({
      data: { email: '' },
      updateField: mockUpdateField,
      submit: mockSubmit,
      processing: false,
      errors: {}
    })
  })

  it('renders the form with an input and a button', () => {
    render(<ConnectionForm />)

    const input = screen.getByPlaceholderText('Votre adresse email')
    const button = screen.getByRole('button', { name: /Continuer/i })

    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'email')
    expect(button).toBeInTheDocument()
  })

  it('calls updateField when typing in the input', () => {
    render(<ConnectionForm />)

    const input = screen.getByPlaceholderText('Votre adresse email')
    fireEvent.change(input, { target: { value: 'test@example.com' } })

    expect(mockUpdateField).toHaveBeenCalledWith('email', 'test@example.com')
  })

  it('disables the button when processing or there is an email error', () => {
    const mockedUseFormHandler = vi.mocked(useFormHandler)
    mockedUseFormHandler.mockReturnValueOnce({
      data: { email: '' },
      updateField: mockUpdateField,
      submit: mockSubmit,
      processing: true,
      errors: {}
    })

    render(<ConnectionForm />)

    const button = screen.getByRole('button', { name: /Continuer/i })

    expect(button).toBeDisabled()

    mockedUseFormHandler.mockReturnValueOnce({
      data: { email: '' },
      updateField: mockUpdateField,
      submit: mockSubmit,
      processing: false,
      errors: { email: 'Invalid email' }
    })

    render(<ConnectionForm />)
    expect(button).toBeDisabled()
  })

  it('calls submit when the form is submitted', async () => {
    render(<ConnectionForm />)

    const form = screen.getByRole('form')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })
  })

  it('displays an error message if email validation fails', () => {
    const mockedUseFormHandler = vi.mocked(useFormHandler)

    mockedUseFormHandler.mockReturnValueOnce({
      data: { email: '' },
      updateField: mockUpdateField,
      submit: mockSubmit,
      processing: false,
      errors: { email: 'Veuillez entrer une adresse email valide.' }
    })

    render(<ConnectionForm />)

    const errorMessage = screen.getByText('Veuillez entrer une adresse email valide.')

    expect(errorMessage).toBeInTheDocument()
  })
})
