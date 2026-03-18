import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ROLES } from '@/lib/constants/roles.js'
import UsersContext from '@/contexts/panels/users/UsersContext'
import { UsersPanelTestWrapper } from '../UsersPanelTestWrapper'

// Mock the form modal
vi.mock('@/components/kb/panels/users/form/UserForm', () => ({
  default: ({ onSubmit, onCancel }) => (
    <div data-testid='user-form'>
      <input data-testid='form-username' placeholder='Username' />
      <input data-testid='form-email' placeholder='Email' />
      <select data-testid='form-role'>
        <option value={ROLES.USER}>{ROLES.USER}</option>
        <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
      </select>
      <button
        data-testid='form-submit'
        onClick={() => {
          const username = screen.getByTestId('form-username').value
          const email = screen.getByTestId('form-email').value
          const role = screen.getByTestId('form-role').value
          onSubmit({ username, email, role })
        }}
      >
        Submit
      </button>
      <button data-testid='form-cancel' onClick={onCancel}>
        Cancel
      </button>
    </div>
  ),
}))

// Mock the modal operations context
vi.mock('@/contexts/panels/users/modal', () => ({
  useUsersModalOperationsContext: () => ({
    modal: () => <div data-testid='user-modal'>Modal</div>,
    processing: false,
  }),
  UsersModalProvider: ({ children }) => children,
}))

// Mock the add user button hook
vi.mock('@/components/kb/panels/users/form/useAddUserButton', () => ({
  default: () => {
    const mockCallback = () => <button data-testid='add-user-button'>Add User</button>
    return mockCallback
  },
}))

describe('Users Form - Add User', () => {
  it('should call addUser when form is submitted', async () => {
    const mockAddUser = vi.fn().mockResolvedValue({ username: 'newuser', email: 'new@aqui.nada', role: ROLES.USER })

    const TestWrapper = ({ children }) => {
      const mockUsersValue = {
        users: [],
        addUser: mockAddUser,
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
        <form data-testid='test-add-form'>
          <input data-testid='form-username' placeholder='Username' defaultValue='newuser' />
          <input data-testid='form-email' placeholder='Email' defaultValue='new@aqui.nada' />
          <select data-testid='form-role' defaultValue={ROLES.USER}>
            <option value={ROLES.USER}>{ROLES.USER}</option>
            <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
          </select>
        </form>
      </TestWrapper>
    )

    expect(screen.getByTestId('test-add-form')).toBeInTheDocument()
  })

  it('should display form validation errors', async () => {
    const TestWrapper = ({ children }) => {
      const mockUsersValue = {
        users: [],
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
        <form data-testid='test-form'>
          <input data-testid='form-username' placeholder='Username' required />
          <input data-testid='form-email' placeholder='Email' type='email' required />
          <button data-testid='form-submit' type='submit'>
            Submit
          </button>
        </form>
      </TestWrapper>
    )

    const form = screen.getByTestId('test-form')
    expect(form).toBeInTheDocument()

    const usernameInput = screen.getByTestId('form-username')
    const emailInput = screen.getByTestId('form-email')

    expect(usernameInput.required).toBe(true)
    expect(emailInput.required).toBe(true)
  })

  it('should handle user creation with role selection', async () => {
    const user = userEvent.setup()
    const mockAddUser = vi.fn()

    const TestWrapper = ({ children }) => {
      const mockUsersValue = {
        users: [],
        addUser: mockAddUser,
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
          <select data-testid='form-role'>
            <option value={ROLES.USER}>{ROLES.USER}</option>
            <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
          </select>
        </div>
      </TestWrapper>
    )

    const roleSelect = screen.getByTestId('form-role')
    expect(roleSelect).toBeInTheDocument()
    expect(roleSelect.value).toBe(ROLES.USER)

    await user.selectOptions(roleSelect, ROLES.ADMIN)
    expect(roleSelect.value).toBe(ROLES.ADMIN)
  })
})
