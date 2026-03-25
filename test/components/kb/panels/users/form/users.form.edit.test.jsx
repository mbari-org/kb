import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { ROLES } from '@/lib/constants/roles.js'
import UsersContext from '@/contexts/panels/users/UsersContext'
import { UsersPanelTestWrapper, mockUsers } from '../users.panel.test.wrapper'

// Mock the edit form modal
vi.mock('@/contexts/panels/users/modal', () => ({
  useUsersModalOperationsContext: () => ({
    modal: null,
    processing: false,
  }),
  UsersModalProvider: ({ children }) => children,
}))

describe('Users - Edit and Lock Operations', () => {
  it('should call editUser when user is edited', async () => {
    const user = userEvent.setup()
    const mockEditUser = vi.fn().mockResolvedValue({})

    const TestWrapper = ({ children }) => {
      const [users] = useState(mockUsers)

      const mockUsersValue = {
        users,
        addUser: vi.fn(),
        editUser: mockEditUser,
        lockUser: vi.fn(),
      }

      return (
        <UsersPanelTestWrapper>
          <UsersContext.Provider value={mockUsersValue}>{children}</UsersContext.Provider>
        </UsersPanelTestWrapper>
      )
    }

    render(
      <TestWrapper>
        <div data-testid='edit-user-wrapper'>
          <button data-testid='edit-dingo' onClick={() => mockEditUser('dingo', { email: 'newemail@aqui.nada' })}>
            Edit Dingo
          </button>
        </div>
      </TestWrapper>
    )

    const editButton = screen.getByTestId('edit-dingo')
    await user.click(editButton)

    expect(mockEditUser).toHaveBeenCalledWith('dingo', { email: 'newemail@aqui.nada' })
  })

  it('should call lockUser when user is locked', async () => {
    const user = userEvent.setup()
    const mockLockUser = vi.fn()

    const TestWrapper = ({ children }) => {
      const mockUsersValue = {
        users: mockUsers,
        addUser: vi.fn(),
        editUser: vi.fn(),
        lockUser: mockLockUser,
      }

      return (
        <UsersPanelTestWrapper>
          <UsersContext.Provider value={mockUsersValue}>{children}</UsersContext.Provider>
        </UsersPanelTestWrapper>
      )
    }

    render(
      <TestWrapper>
        <div>
          <button data-testid='lock-dingo' onClick={() => mockLockUser('dingo', true)}>
            Lock Dingo
          </button>
        </div>
      </TestWrapper>
    )

    const lockButton = screen.getByTestId('lock-dingo')
    await user.click(lockButton)

    expect(mockLockUser).toHaveBeenCalledWith('dingo', true)
  })

  it('should call lockUser with false to unlock user', async () => {
    const user = userEvent.setup()
    const mockLockUser = vi.fn()

    const TestWrapper = ({ children }) => {
      const mockUsersValue = {
        users: mockUsers,
        addUser: vi.fn(),
        editUser: vi.fn(),
        lockUser: mockLockUser,
      }

      return (
        <UsersPanelTestWrapper>
          <UsersContext.Provider value={mockUsersValue}>{children}</UsersContext.Provider>
        </UsersPanelTestWrapper>
      )
    }

    render(
      <TestWrapper>
        <div>
          <button data-testid='unlock-dingosky' onClick={() => mockLockUser('dingosky', false)}>
            Unlock Dingosky
          </button>
        </div>
      </TestWrapper>
    )

    const unlockButton = screen.getByTestId('unlock-dingosky')
    await user.click(unlockButton)

    expect(mockLockUser).toHaveBeenCalledWith('dingosky', false)
  })

  it('should track locked status in users list', () => {
    const TestWrapper = ({ children }) => {
      const mockUsersValue = {
        users: mockUsers,
        addUser: vi.fn(),
        editUser: vi.fn(),
        lockUser: vi.fn(),
      }

      return (
        <UsersPanelTestWrapper>
          <UsersContext.Provider value={mockUsersValue}>{children}</UsersContext.Provider>
        </UsersPanelTestWrapper>
      )
    }

    render(
      <TestWrapper>
        <div>
          {mockUsers.map(u => (
            <div key={u.username} data-testid={`user-status-${u.username}`}>
              {u.username}: {u.locked ? 'locked' : 'active'}
            </div>
          ))}
        </div>
      </TestWrapper>
    )

    expect(screen.getByTestId('user-status-dingo')).toHaveTextContent('dingo: active')
    expect(screen.getByTestId('user-status-sky')).toHaveTextContent('sky: active')
    expect(screen.getByTestId('user-status-dingosky')).toHaveTextContent('dingosky: locked')
  })

  it('should handle multiple user edits in sequence', async () => {
    const user = userEvent.setup()
    const mockEditUser = vi.fn()

    const TestWrapper = ({ children }) => {
      const mockUsersValue = {
        users: mockUsers,
        addUser: vi.fn(),
        editUser: mockEditUser,
        lockUser: vi.fn(),
      }

      return (
        <UsersPanelTestWrapper>
          <UsersContext.Provider value={mockUsersValue}>{children}</UsersContext.Provider>
        </UsersPanelTestWrapper>
      )
    }

    render(
      <TestWrapper>
        <div>
          <button data-testid='edit-dingo' onClick={() => mockEditUser('dingo', { role: ROLES.ADMIN })}>
            Promote Dingo
          </button>
          <button data-testid='edit-sky' onClick={() => mockEditUser('sky', { email: 'sky.new@aqui.nada' })}>
            Update Sky
          </button>
        </div>
      </TestWrapper>
    )

    await user.click(screen.getByTestId('edit-dingo'))
    expect(mockEditUser).toHaveBeenCalledWith('dingo', { role: ROLES.ADMIN })

    await user.click(screen.getByTestId('edit-sky'))
    expect(mockEditUser).toHaveBeenCalledWith('sky', { email: 'sky.new@aqui.nada' })

    expect(mockEditUser).toHaveBeenCalledTimes(2)
  })
})
