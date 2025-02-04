import { render, screen } from '@testing-library/react'
import InputError from '@/components/shared/InputError'
import { describe, it, expect } from 'vitest'

describe('InputError', () => {
  it('renders the error message', () => {
    render(<InputError>Some error text</InputError>)
    expect(screen.getByText('Some error text')).toBeInTheDocument()
  })
})
