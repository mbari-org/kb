import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import useRealizationColumns from '@/components/kb/panels/realizations/table/data/useRealizationColumns'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

const openPendingItem = vi.fn()

vi.mock('react-icons/md', () => ({
  MdOutlineDeleteForever: () => <span>delete-icon</span>,
}))

vi.mock('react-icons/ci', () => ({
  CiEdit: () => <span>edit-icon</span>,
}))

vi.mock('react-icons/pi', () => ({
  PiStamp: () => <span>stamp-icon</span>,
}))

vi.mock('@/components/kb/panels/history/pending/usePendingItemModal', () => ({
  default: () => openPendingItem,
}))

const REALIZATION = {
  id: 1,
  concept: 'dingo',
  linkName: 'eats',
  toConcept: 'nil',
  linkValue: 'fish',
}

const PENDING_ITEM = {
  id: 'pending-1',
  action: 'Edit',
  concept: 'dingo',
  field: 'Realization',
  oldValue: 'eats | nil | fish',
  newValue: 'eats | nil | weekly',
}

const createWrapper = ({ isAdmin = false, isReadOnly = false, pendingItem = null } = {}) => {
  const getPendingRealizationItem = vi.fn(() => pendingItem)
  const updateFilters = vi.fn()
  const updateSelected = vi.fn()

  const Wrapper = ({ children }) => (
    <UserContext.Provider value={{ isAdmin, isReadOnly }}>
      <RealizationsContext.Provider value={{ getPendingRealizationItem, updateFilters }}>
        <SelectedContext.Provider value={{ updateSelected }}>{children}</SelectedContext.Provider>
      </RealizationsContext.Provider>
    </UserContext.Provider>
  )
  Wrapper.displayName = 'UseRealizationColumnsTestWrapper'

  return { Wrapper }
}

const renderActionsCell = ({ isAdmin, isReadOnly, pendingItem } = {}) => {
  const deleteRealizationModal = vi.fn()
  const editRealizationModal = vi.fn()
  const { Wrapper } = createWrapper({ isAdmin, isReadOnly, pendingItem })

  const { result } = renderHook(() => useRealizationColumns({ deleteRealizationModal, editRealizationModal }), {
    wrapper: Wrapper,
  })

  const actionsColumn = result.current.find(column => column.field === 'actions')
  const rendered = render(actionsColumn.renderCell({ row: REALIZATION }), { wrapper: Wrapper })

  return { ...rendered, deleteRealizationModal, editRealizationModal }
}

describe('useRealizationColumns actions column', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('is the first column', () => {
    const { Wrapper } = createWrapper()

    const { result } = renderHook(
      () => useRealizationColumns({ deleteRealizationModal: vi.fn(), editRealizationModal: vi.fn() }),
      { wrapper: Wrapper }
    )

    expect(result.current[0].field).toBe('actions')
  })

  it('renders delete and edit buttons for a normal row and wires their clicks', async () => {
    const user = userEvent.setup()
    const { deleteRealizationModal, editRealizationModal } = renderActionsCell()

    const deleteButton = screen.getByText('delete-icon').closest('button')
    const editButton = screen.getByText('edit-icon').closest('button')

    expect(deleteButton).toBeEnabled()
    expect(editButton).toBeEnabled()

    await user.click(deleteButton)
    expect(deleteRealizationModal).toHaveBeenCalledWith(REALIZATION)

    await user.click(editButton)
    expect(editRealizationModal).toHaveBeenCalledWith(REALIZATION)
  })

  it('renders no action buttons for a non-admin row with pending history', () => {
    const { container } = renderActionsCell({ pendingItem: PENDING_ITEM })

    expect(container).toBeEmptyDOMElement()
  })

  it('renders approve/reject stamp for an admin on a pending row', async () => {
    const user = userEvent.setup()
    renderActionsCell({ isAdmin: true, pendingItem: PENDING_ITEM })

    expect(screen.queryByText('delete-icon')).not.toBeInTheDocument()
    expect(screen.queryByText('edit-icon')).not.toBeInTheDocument()

    const stampButton = screen.getByText('stamp-icon').closest('button')
    await user.click(stampButton)

    expect(openPendingItem).toHaveBeenCalledWith({
      conceptName: PENDING_ITEM.concept,
      item: PENDING_ITEM,
    })
  })

  it('disables action buttons for a read-only user', () => {
    const { deleteRealizationModal, editRealizationModal } = renderActionsCell({ isReadOnly: true })

    const deleteButton = screen.getByText('delete-icon').closest('button')
    const editButton = screen.getByText('edit-icon').closest('button')

    expect(deleteButton).toBeDisabled()
    expect(editButton).toBeDisabled()

    deleteButton.click()
    editButton.click()

    expect(deleteRealizationModal).not.toHaveBeenCalled()
    expect(editRealizationModal).not.toHaveBeenCalled()
  })
})
