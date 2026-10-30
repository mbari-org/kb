import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import useRealizationColumns from '@/components/kb/panels/realizations/table/data/useRealizationColumns'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

vi.mock('react-icons/md', () => ({
  MdOutlineDeleteForever: () => <span>delete-icon</span>,
}))

vi.mock('react-icons/ci', () => ({
  CiEdit: () => <span>edit-icon</span>,
}))

const REALIZATION = {
  id: 1,
  concept: 'dingo',
  linkName: 'eats',
  toConcept: 'nil',
  linkValue: 'fish',
}

const createWrapper = ({ isReadOnly = false, pendingAction = null } = {}) => {
  const getPendingRealizationAction = vi.fn(() => pendingAction)
  const updateFilters = vi.fn()
  const updateSelected = vi.fn()

  const Wrapper = ({ children }) => (
    <UserContext.Provider value={{ isReadOnly }}>
      <RealizationsContext.Provider value={{ getPendingRealizationAction, updateFilters }}>
        <SelectedContext.Provider value={{ updateSelected }}>{children}</SelectedContext.Provider>
      </RealizationsContext.Provider>
    </UserContext.Provider>
  )
  Wrapper.displayName = 'UseRealizationColumnsTestWrapper'

  return { Wrapper }
}

const renderActionsCell = ({ isReadOnly, pendingAction } = {}) => {
  const deleteRealizationModal = vi.fn()
  const editRealizationModal = vi.fn()
  const { Wrapper } = createWrapper({ isReadOnly, pendingAction })

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

  it('renders no action buttons for a row with a pending action', () => {
    const { container } = renderActionsCell({ pendingAction: 'Edit' })

    expect(container).toBeEmptyDOMElement()
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
