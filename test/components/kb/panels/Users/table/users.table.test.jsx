import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useState } from 'react'

import UsersTableData from '@/components/kb/panels/users/table/data/UsersTableData'
import UsersContext from '@/contexts/panels/users/UsersContext'

import { UsersPanelTestWrapper, mockUsers } from '../UsersPanelTestWrapper'

// Mock pagination component
vi.mock('@/components/kb/panels/users/table/data/UsersPagination', () => ({
  default: ({ count, limit, offset, nextPage, prevPage, setPageSize }) => (
    <div data-testid='pagination'>
      <span data-testid='pagination-count'>{count} users</span>
      <span data-testid='pagination-offset'>{offset} offset</span>
      <button data-testid='pagination-prev' onClick={prevPage} disabled={offset === 0}>
        Previous
      </button>
      <button data-testid='pagination-next' onClick={nextPage} disabled={offset + limit >= count}>
        Next
      </button>
      <select data-testid='pagination-limit' value={limit} onChange={e => setPageSize(parseInt(e.target.value))}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
    </div>
  ),
}))

// Mock PanelDataGrid component
vi.mock('@/components/common/panel/PanelDataGrid', () => ({
  default: ({ columns, rows, paginationComponent }) => (
    <div data-testid='users-table'>
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.field} data-testid={`column-${col.field}`}>
                {col.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} data-testid={`user-row-${idx}`}>
              {columns.map(col => (
                <td key={`${idx}-${col.field}`} data-testid={`cell-${idx}-${col.field}`}>
                  {col.renderCell ? col.renderCell({ row }) : row[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {paginationComponent}
    </div>
  ),
}))

// Mock useUserColumns hook
vi.mock('@/components/kb/panels/users/table/data/useUserColumns', () => ({
  default: () => [
    { field: 'username', headerName: 'Username' },
    { field: 'email', headerName: 'Email' },
    { field: 'role', headerName: 'Role' },
    { field: 'locked', headerName: 'Locked' },
  ],
}))

// Mock form buttons
vi.mock('@/components/kb/panels/users/form/useEditUserButton', () => ({
  default: () => vi.fn(() => <button>Edit</button>),
}))

vi.mock('@/components/kb/panels/users/form/useLockUserButton', () => ({
  default: () => vi.fn(() => <button>Lock</button>),
}))

// Mock pagination constants
vi.mock('@/lib/constants/pagination.js', () => ({
  PAGINATION: {
    USERS: {
      DEFAULT_LIMIT: 10,
      PAGE_SIZE_OPTIONS: [10, 25, 50],
    },
  },
}))

describe('Users Table Data', () => {
  const TestWrapper = ({ children }) => {
    const [users] = useState(mockUsers)

    const mockUsersValue = {
      users,
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

  it('should render the users table with all columns', () => {
    render(
      <TestWrapper>
        <UsersTableData />
      </TestWrapper>
    )

    expect(screen.getByTestId('users-table')).toBeInTheDocument()
    expect(screen.getByTestId('column-username')).toBeInTheDocument()
    expect(screen.getByTestId('column-email')).toBeInTheDocument()
    expect(screen.getByTestId('column-role')).toBeInTheDocument()
    expect(screen.getByTestId('column-locked')).toBeInTheDocument()
  })

  it('should display all users in the table', () => {
    render(
      <TestWrapper>
        <UsersTableData />
      </TestWrapper>
    )

    mockUsers.forEach((user, idx) => {
      expect(screen.getByTestId(`user-row-${idx}`)).toBeInTheDocument()
      expect(screen.getByTestId(`cell-${idx}-username`)).toHaveTextContent(user.username)
      expect(screen.getByTestId(`cell-${idx}-email`)).toHaveTextContent(user.email)
      expect(screen.getByTestId(`cell-${idx}-role`)).toHaveTextContent(user.role)
    })
  })

  it('should render pagination component', () => {
    render(
      <TestWrapper>
        <UsersTableData />
      </TestWrapper>
    )

    expect(screen.getByTestId('pagination')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-count')).toHaveTextContent('3 users')
  })

  it('should display correct pagination offset initially', () => {
    render(
      <TestWrapper>
        <UsersTableData />
      </TestWrapper>
    )

    expect(screen.getByTestId('pagination-offset')).toHaveTextContent('0 offset')
  })

  it('should have disabled previous button when at first page', () => {
    render(
      <TestWrapper>
        <UsersTableData />
      </TestWrapper>
    )

    const prevButton = screen.getByTestId('pagination-prev')
    expect(prevButton).toBeDisabled()
  })

  it('should have enabled next button when there are more users', () => {
    render(
      <TestWrapper>
        <UsersTableData />
      </TestWrapper>
    )

    const nextButton = screen.getByTestId('pagination-next')
    expect(nextButton).toBeDisabled()
  })
})
