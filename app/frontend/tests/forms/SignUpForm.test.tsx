import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { forwardRef, useImperativeHandle } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUpForm from '@/components/forms/SignUpForm'
import useFormHandler from '@/hooks/useFormHandler'

vi.mock('@inertiajs/react', async () => {
  const actual = await vi.importActual('@inertiajs/react')
  return {
    ...actual,
    router: {
      get: vi.fn(),
      post: vi.fn()
      // Mock other methods if used
    }
  }
})

// Setup a spy for executeAsync
const executeAsyncSpy = vi.fn(async () => 'token')

// Mock useFormHandler hook
vi.mock('@/hooks/useFormHandler', () => ({
  default: vi.fn(() => ({
    data: {
      email: '',
      first_name: '',
      last_name: '',
      accepts_conditions: false,
      recaptcha_token: ''
    },
    updateField: vi.fn(),
    submit: vi.fn((e: Event) => e.preventDefault()),
    processing: false,
    errors: {}
  }))
}))

// Mock ReCAPTCHA
vi.mock('react-google-recaptcha', () => {
  const RecaptchaV2 = forwardRef<any, any>((props, ref) => {
    useImperativeHandle(ref, () => ({
      executeAsync: executeAsyncSpy,
      execute: () => {},
      reset: () => {},
      getValue: () => 'token',
      getWidgetId: () => 1,
      render: () => null,
      expire: () => {},
      isReady: () => true,
      remove: () => {}
    }))
    return (
      <input
        type='checkbox'
        onClick={() => {
          props.asyncScriptOnLoad?.()
        }}
        {...props}
      />
    )
  })

  return { default: RecaptchaV2 }
})

describe('SignUpForm', () => {
  let mockUpdateField: Mock
  let mockSubmit: Mock

  beforeEach(() => {
    const mockedUseFormHandler = vi.mocked(useFormHandler)
    mockUpdateField = vi.fn()
    mockSubmit = vi.fn((e) => e.preventDefault())

    mockedUseFormHandler.mockReturnValue({
      data: {
        email: '',
        first_name: '',
        last_name: '',
        accepts_conditions: false,
        recaptcha_token: ''
      },
      updateField: mockUpdateField,
      submit: mockSubmit,
      processing: false,
      errors: {}
    })
  })

  it('renders all form inputs and button', () => {
    render(<SignUpForm />)

    const firstNameInput = screen.getByLabelText('Prénom :')
    const lastNameInput = screen.getByLabelText('Nom :')
    const checkbox = screen.getByLabelText(/Termes et Conditions/i)
    const button = screen.getByRole('button', { name: /Continuer/i })

    expect(firstNameInput).toBeInTheDocument()
    expect(lastNameInput).toBeInTheDocument()
    expect(checkbox).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })

  it('updates fields when inputs are changed', () => {
    render(<SignUpForm />)

    const firstNameInput = screen.getByLabelText('Prénom :')
    fireEvent.change(firstNameInput, { target: { value: 'John' } })

    expect(mockUpdateField).toHaveBeenCalledWith('first_name', 'John')
  })

  it('disables the button when processing or conditions are not accepted', () => {
    const mockedUseFormHandler = vi.mocked(useFormHandler)
    mockedUseFormHandler.mockReturnValueOnce({
      data: {
        email: '',
        first_name: '',
        last_name: '',
        accepts_conditions: false,
        recaptcha_token: ''
      },
      updateField: mockUpdateField,
      submit: mockSubmit,
      processing: true,
      errors: {}
    })

    render(<SignUpForm />)

    const button = screen.getByRole('button', { name: /Continuer/i })
    expect(button).toBeDisabled()
  })

  it('submits the form after ReCAPTCHA validation and calls executeAsync', async () => {
    render(<SignUpForm />)

    const firstNameInput = screen.getByLabelText('Prénom :')
    const lastNameInput = screen.getByLabelText('Nom :')
    const termsCheckbox = screen.getByLabelText(/Termes et Conditions/i)
    const form = screen.getByRole('form')

    // Fill form
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } })
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
    fireEvent.click(termsCheckbox)

    // Submit
    fireEvent.submit(form)

    await waitFor(() => {
      expect(executeAsyncSpy).toHaveBeenCalled()
      expect(mockSubmit).toHaveBeenCalled()
    })
  })
})
