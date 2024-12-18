import { render, screen } from '@testing-library/react'
import { ConnectionForm } from '@/components/forms/ConnectionForm'
import { useConnectionForm } from '@/hooks/useConnectionForm'
import { vi, describe, it, expect } from 'vitest'

vi.mock('@/hooks/useConnectionForm')

describe('ConnectionForm', () => {
  it('displays error message if errors.email is present', () => {
    const mockedUseConnectionForm = vi.mocked(useConnectionForm)
    mockedUseConnectionForm.mockReturnValueOnce({
      data: { email: '' },
      errors: { email: 'Invalid email' },
      processing: false,
      updateEmail: vi.fn(),
      validateAndSubmit: vi.fn()
    })

    render(<ConnectionForm />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })
})
