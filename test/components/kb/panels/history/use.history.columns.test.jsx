import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import useHistoryColumns from '@/components/kb/panels/history/useHistoryColumns'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
import UserContext from '@/contexts/user/UserContext'
import { ROLES } from '@/lib/constants/roles'
import { SELECTED } from '@/lib/constants/selected'

const openPendingItem = vi.fn()

vi.mock('@/components/kb/panels/history/pending/usePendingItemModal', () => ({
  default: () => openPendingItem,
}))

vi.mock('@/components/icon/StampIcon', () => ({
  default: ({ onClick }) => (
    <button onClick={onClick} type='button'>
      stamp
    </button>
  ),
}))

const createWrapper = ({ role = ROLES.ADMIN } = {}) => {
  const updateSelected = vi.fn()
  const updateSettings = vi.fn()

  const Wrapper = ({ children }) => (
    <UserContext.Provider value={{ isAdmin: role === ROLES.ADMIN, user: { role } }}>
      <SelectedContext.Provider value={{ updateSelected }}>
        <SelectedSettingsContext.Provider value={{ updateSettings }}>
          {children}
        </SelectedSettingsContext.Provider>
      </SelectedContext.Provider>
    </UserContext.Provider>
  )
  Wrapper.displayName = 'UseHistoryColumnsTestWrapper'

  return { updateSelected, updateSettings, Wrapper }
}

const getFields = columns => columns.map(column => column.field)

describe('useHistoryColumns', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns expected field sets by history type', () => {
    const adminWrapper = createWrapper({ role: ROLES.ADMIN })

    const { result: pendingResult } = renderHook(
      () => useHistoryColumns({ type: SELECTED.SETTINGS.HISTORY.TYPES.PENDING }),
      { wrapper: adminWrapper.Wrapper }
    )
    const pendingFields = getFields(pendingResult.current)
    expect(pendingFields[0]).toBe('inspect')
    expect(pendingFields).toContain('concept')
    expect(pendingFields).not.toContain('approved')

    const { result: approvedResult } = renderHook(
      () => useHistoryColumns({ type: SELECTED.SETTINGS.HISTORY.TYPES.APPROVED }),
      { wrapper: adminWrapper.Wrapper }
    )
    const approvedFields = getFields(approvedResult.current)
    expect(approvedFields[0]).toBe('concept')
    expect(approvedFields).not.toContain('inspect')
    expect(approvedFields).toContain('processorName')
    expect(approvedFields).toContain('processedTimestamp')

    const { result: conceptResult } = renderHook(
      () => useHistoryColumns({ type: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT }),
      { wrapper: adminWrapper.Wrapper }
    )
    const conceptFields = getFields(conceptResult.current)
    expect(conceptFields[0]).toBe('approved')
    expect(conceptFields).toContain('processorName')
    expect(conceptFields).toContain('processedTimestamp')
    expect(conceptFields).not.toContain('inspect')
  })

  it('marks server-sortable columns for approved type', () => {
    const { Wrapper } = createWrapper()

    const { result: approvedResult } = renderHook(
      () => useHistoryColumns({ type: SELECTED.SETTINGS.HISTORY.TYPES.APPROVED }),
      { wrapper: Wrapper }
    )
    const approvedByField = Object.fromEntries(
      approvedResult.current.map(column => [column.field, column])
    )
    const approvedSortable = [
      'action',
      'concept',
      'creationTimestamp',
      'creatorName',
      'field',
      'newValue',
      'oldValue',
      'processedTimestamp',
      'processorName',
    ]
    approvedSortable.forEach(field => {
      expect(approvedByField[field].sortable, field).toBe(true)
    })

    const { result: pendingResult } = renderHook(
      () => useHistoryColumns({ type: SELECTED.SETTINGS.HISTORY.TYPES.PENDING }),
      { wrapper: Wrapper }
    )
    const pendingByField = Object.fromEntries(
      pendingResult.current.map(column => [column.field, column])
    )
    expect(pendingByField.concept.sortable).toBe(true)
    expect(pendingByField.creatorName.sortable).toBe(true)

    const { result: conceptResult } = renderHook(
      () => useHistoryColumns({ type: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT }),
      { wrapper: Wrapper }
    )
    const conceptByField = Object.fromEntries(
      conceptResult.current.map(column => [column.field, column])
    )
    expect(conceptByField.concept.sortable).toBe(false)
    expect(conceptByField.approved.sortable).toBe(true)
  })

  it('fires approval action from pending inspect column and filter action from concept cell for admin user', async () => {
    const user = userEvent.setup()
    const { Wrapper, updateSelected, updateSettings } = createWrapper({ role: ROLES.ADMIN })
    const row = { id: 'pending-1', concept: 'dingo', field: 'name' }

    const { result } = renderHook(
      () => useHistoryColumns({ type: SELECTED.SETTINGS.HISTORY.TYPES.PENDING }),
      { wrapper: Wrapper }
    )

    const inspectColumn = result.current.find(column => column.field === 'inspect')
    const { unmount } = render(inspectColumn.renderCell({ row }))
    expect(screen.queryByRole('button', { name: 'filter' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'stamp' }))
    expect(openPendingItem).toHaveBeenCalledWith({ conceptName: 'dingo', item: row })
    unmount()

    const conceptColumn = result.current.find(column => column.field === 'concept')
    render(conceptColumn.renderCell({ row, value: row.concept }))
    await user.click(screen.getByText('dingo'))
    expect(updateSelected).toHaveBeenCalledWith({ [SELECTED.CONCEPT]: 'dingo' })
    expect(updateSettings).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.HISTORY.KEY]: {
        [SELECTED.SETTINGS.HISTORY.TYPE]: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT,
      },
    })
  })

  it('omits pending inspect column for non-admin user', () => {
    const { Wrapper } = createWrapper({ role: ROLES.USER })

    const { result } = renderHook(
      () => useHistoryColumns({ type: SELECTED.SETTINGS.HISTORY.TYPES.PENDING }),
      { wrapper: Wrapper }
    )

    expect(result.current.map(column => column.field)).not.toContain('inspect')
  })

  it('renders approved column values for concept history based on item state', async () => {
    const user = userEvent.setup()
    const { Wrapper } = createWrapper({ role: ROLES.ADMIN })
    const pendingRow = { id: 'pending-2', concept: 'dingo', processedTimestamp: null, approved: false }
    const approvedRow = { id: 'approved-1', processedTimestamp: '2026-01-01T00:00:00Z', approved: true }
    const rejectedRow = { id: 'rejected-1', processedTimestamp: '2026-01-01T00:00:00Z', approved: false }

    const { result } = renderHook(
      () => useHistoryColumns({ type: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT }),
      { wrapper: Wrapper }
    )

    const approvedColumn = result.current.find(column => column.field === 'approved')

    const { rerender } = render(approvedColumn.renderCell({ row: pendingRow }))
    expect(screen.getByRole('button', { name: 'stamp' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'stamp' }))
    expect(openPendingItem).toHaveBeenCalledWith({ conceptName: 'dingo', item: pendingRow })

    rerender(approvedColumn.renderCell({ row: approvedRow }))
    expect(screen.getByText('Yes')).toBeInTheDocument()

    rerender(approvedColumn.renderCell({ row: rejectedRow }))
    expect(screen.getByText('No')).toBeInTheDocument()
  })

  it('shows Pending text for concept pending rows when user is non-admin', () => {
    const { Wrapper } = createWrapper({ role: ROLES.USER })
    const pendingRow = { id: 'pending-3', concept: 'dingo', processedTimestamp: null, approved: false }

    const { result } = renderHook(
      () => useHistoryColumns({ type: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT }),
      { wrapper: Wrapper }
    )

    const approvedColumn = result.current.find(column => column.field === 'approved')
    render(approvedColumn.renderCell({ row: pendingRow }))

    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'stamp' })).not.toBeInTheDocument()
  })
})
