import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
// import { router } from '@inertiajs/react'
import Show from '@/pages/User/Show'
// import UserAvatarEdit from '@/components/pages/user/show/UserAvatarEdit'

vi.mock('@inertiajs/react', async () => {
  const actual = await vi.importActual('@inertiajs/react')
  return {
    ...actual,
    usePage: () => ({
      props: {}
    }),
    Head: ({ children }: { children: React.ReactNode }) => <>{children}</>
  }
})

vi.mock('@/components/pages/user/show/UserAvatarEdit', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid='user-avatar-edit' />)
}))

describe('Show', () => {
  const user = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    created_at: '2024-01-01'
  }
  const currentUser = { id: 1, first_name: 'John' }
  const profilePictureUrl = 'mock-profile-url.jpg'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the UserAvatarEdit component if user is currentUser', () => {
    render(
      <Show
        user={user}
        currentUser={currentUser}
        profile_picture_url={profilePictureUrl}
      />
    )
    expect(screen.getByTestId('user-avatar-edit')).toBeInTheDocument()
  })

  it('does not render the UserAvatarEdit component if user is not currentUser', () => {
    render(
      <Show
        user={{ ...user, id: 2 }}
        currentUser={currentUser}
        profile_picture_url={null}
      />
    )
    expect(screen.queryByTestId('user-avatar-edit')).toBeNull()
  })

  it('renders user info', () => {
    render(
      <Show
        user={user}
        currentUser={currentUser}
        profile_picture_url={profilePictureUrl}
      />
    )
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Inscrit depuis le 01 janvier 2024.')).toBeInTheDocument()
    // Social icons
    // e.g., getByRole('link', { name: /facebook/i }) if you label them
  })

  it('shows "Mes paramètres" when user is currentUser', () => {
    render(
      <Show
        user={user}
        currentUser={currentUser}
        profile_picture_url={profilePictureUrl}
      />
    )
    expect(screen.getByText('Mes paramètres')).toBeInTheDocument()
  })

  it('hides "Mes paramètres" if user is different from currentUser', () => {
    render(
      <Show
        user={{ ...user, id: 2 }}
        currentUser={currentUser}
        profile_picture_url={null}
      />
    )
    expect(screen.queryByText('Mes paramètres')).toBeNull()
  })
})

// -------------------------------
// Tests for UserAvatarEdit
// -------------------------------
// describe('UserAvatarEdit', () => {
//   beforeEach(() => {
//     vi.clearAllMocks()
//   })

//   it('renders the edit button', () => {
//     render(<UserAvatarEdit userId={1} hasProfilePicture />)
//     expect(screen.getByRole('button', { name: /pencil/i })).toBeInTheDocument()
//   })

//   it('allows deleting the profile picture', () => {
//     render(<UserAvatarEdit userId={1} hasProfilePicture />)

//     // open popover
//     fireEvent.click(screen.getByRole('button', { name: /pencil/i }))
//     // open alert dialog
//     fireEvent.click(screen.getByRole('button', { name: /trash/i }))
//     // confirm delete
//     fireEvent.click(screen.getByText('Continuer'))

//     expect(router.delete).toHaveBeenCalledWith('/users/1/profile_picture', {
//       onSuccess: expect.any(Function)
//     })
//   })

//   it('shows file input validation errors', async () => {
//     render(<UserAvatarEdit userId={1} hasProfilePicture={false} />)
//     fireEvent.click(screen.getByRole('button', { name: /pencil/i }))
//     // Submitting with no file
//     fireEvent.click(screen.getByRole('button', { name: /mettre à jour/i }))
//     // Expect error? (You might mock something about the form errors)
//   })
// })
