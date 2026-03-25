import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import Users from '@/components/kb/panels/Users'
import UsersContext from '@/contexts/panels/users/UsersContext'
import { UsersModalProvider } from '@/contexts/panels/users/modal'

import { UsersPanelTestWrapper, mockUsers } from './users.panel.test.wrapper'

// Mock the modal context
vi.mock('@/contexts/panels/users/modal', () => ({
  UseUsersModalOperationsContext: () => ({
    modal: null,
    processing: false,
  }),
  useUsersModalOperationsContext: () => ({
    modal: null,
    processing: false,
  }),
  UsersModalProvider: ({ children }) => children,
}))

// Mock the panel factory
vi.mock('@/components/common/panel/usePanelFactory', () => ({
  default: () => ({
    createTablePanel: ({ header, tableHeader, tableData }) => (
      <div data-testid='table-panel'>
        <div data-testid='panel-header'>{header.headerTitle}</div>
        <div data-testid='table-header'>
          {tableHeader.headerLeft}
          {tableHeader.headerRight}
        </div>
        <div data-testid='table-data'>{tableData.content}</div>
      </div>
    ),
  }),
}))

// Mock header components
vi.mock('@/components/common/panel/PanelHeaderTitle', () => ({
  default: ({ title }) => <div data-testid='header-title'>{title}</div>,
}))

vi.mock('@/components/kb/panels/users/table/header/UsersTableHeaderLeft', () => ({
  default: () => <div data-testid='table-header-left'>Header Left</div>,
}))

// Mock table components
vi.mock('@/components/kb/panels/users/table/data/UsersTableData', () => ({
  default: () => <div data-testid='users-table-data'>Users Table</div>,
}))

// Mock form components
vi.mock('@/components/kb/panels/users/form/useAddUserButton', () => ({
  default: () => () => <button data-testid='add-user-button'>Add User</button>,
}))

vi.mock('@/contexts/panels/users/UsersProvider', () => ({
  default: ({ children }) => children,
}))

describe('Users Panel Rendering', () => {
  it('should render the Users panel with header and table components', () => {
    const TestWrapper = () => {
      const mockUsersValue = {
        users: mockUsers,
        addUser: vi.fn(),
        editUser: vi.fn(),
        lockUser: vi.fn(),
      }

      return (
        <UsersPanelTestWrapper>
          <UsersContext.Provider value={mockUsersValue}>
            <UsersModalProvider>
              <Users />
            </UsersModalProvider>
          </UsersContext.Provider>
        </UsersPanelTestWrapper>
      )
    }

    render(<TestWrapper />)

    expect(screen.getByTestId('table-panel')).toBeInTheDocument()
    expect(screen.getByTestId('panel-header')).toBeInTheDocument()
    expect(screen.getByTestId('table-header')).toBeInTheDocument()
    expect(screen.getByTestId('table-data')).toBeInTheDocument()
  })

  it('should include add user button in headerRight', () => {
    const TestWrapper = () => {
      const mockUsersValue = {
        users: mockUsers,
        addUser: vi.fn(),
        editUser: vi.fn(),
        lockUser: vi.fn(),
      }

      return (
        <UsersPanelTestWrapper>
          <UsersContext.Provider value={mockUsersValue}>
            <UsersModalProvider>
              <Users />
            </UsersModalProvider>
          </UsersContext.Provider>
        </UsersPanelTestWrapper>
      )
    }

    render(<TestWrapper />)

    expect(screen.getByTestId('add-user-button')).toBeInTheDocument()
  })
})
