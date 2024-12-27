import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { router } from '@inertiajs/react'
import UserAvatarEdit from '@/components/pages/user/show/UserAvatarEdit'

vi.mock('@inertiajs/react', () => ({
  router: {
    delete: vi.fn()
  },
  useForm: () => ({
    data: {},
    setData: vi.fn(),
    patch: vi.fn(),
    processing: false,
    errors: {},
    clearErrors: vi.fn(),
    hasErrors: false
  })
}))

describe('UserAvatarEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the edit button', () => {
    render(<UserAvatarEdit userId={1} hasProfilePicture />)
    expect(screen.getByLabelText('Modifier la photo de profil')).toBeInTheDocument()
  })

  it("doesn't render the delete button", () => {
    render(<UserAvatarEdit userId={1} hasProfilePicture={false} />)
    expect(screen.queryByLabelText('Supprimer la photo de profil')).toBeNull()
  })

  it('allows deleting the profile picture', () => {
    render(<UserAvatarEdit userId={1} hasProfilePicture />)

    // open popover
    fireEvent.click(screen.getByLabelText('Modifier la photo de profil'))
    // open alert dialog
    fireEvent.click(screen.getByLabelText('Supprimer la photo de profil'))
    // confirm delete
    fireEvent.click(screen.getByText('Continuer'))

    expect(router.delete).toHaveBeenCalledWith('/users/1/profile_picture', {
      onSuccess: expect.any(Function)
    })
  })
})
