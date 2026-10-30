import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useEditRealizationButton from '@/components/kb/panels/realizations/form/useEditRealizationButton'
import useDeleteRealizationButton from '@/components/kb/panels/realizations/form/useDeleteRealizationButton'
import { createDeleteRealizationContent } from '@/components/kb/panels/realizations/form/realizationModalUtils'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import CONFIG from '@/lib/config'

let mockModalData = null
let createModalMock
let closeModalMock
let updateModalDataMock
let withProcessingMock
let editRealizationMock
let deleteRealizationMock

vi.mock('@/contexts/panels/realizations/modal', () => ({
  useRealizationsModalOperationsContext: () => ({
    closeModal: closeModalMock,
    createModal: createModalMock,
    updateModalData: updateModalDataMock,
    withProcessing: withProcessingMock,
  }),
  useRealizationsModalDataContext: () => ({
    modalData: mockModalData,
  }),
}))

vi.mock('react-error-boundary', () => ({
  useErrorBoundary: () => ({
    showBoundary: vi.fn(),
  }),
}))

const REALIZATION = {
  id: 1,
  concept: 'dingo',
  linkName: 'eats',
  toConcept: 'nil',
  linkValue: 'fish',
}

const EditButtonHarness = ({ realization }) => {
  const openEditModal = useEditRealizationButton()
  return (
    <button onClick={() => openEditModal(realization)} type='button'>
      Open Edit
    </button>
  )
}

const DeleteButtonHarness = ({ realization }) => {
  const openDeleteModal = useDeleteRealizationButton()
  return (
    <button onClick={() => openDeleteModal(realization)} type='button'>
      Open Delete
    </button>
  )
}

const renderEditHarness = () => {
  const realizationsValue = {
    editRealization: editRealizationMock,
  }
  const panelDataValue = { realizations: [] }

  return render(
    <PanelDataContext.Provider value={panelDataValue}>
      <RealizationsContext.Provider value={realizationsValue}>
        <EditButtonHarness realization={REALIZATION} />
      </RealizationsContext.Provider>
    </PanelDataContext.Provider>
  )
}

const renderDeleteHarness = () => {
  const realizationsValue = {
    deleteRealization: deleteRealizationMock,
  }
  const panelDataValue = { realizations: [] }

  return render(
    <PanelDataContext.Provider value={panelDataValue}>
      <RealizationsContext.Provider value={realizationsValue}>
        <DeleteButtonHarness realization={REALIZATION} />
      </RealizationsContext.Provider>
    </PanelDataContext.Provider>
  )
}

describe('Realizations modal confirmation flows', () => {
  beforeEach(() => {
    mockModalData = null
    createModalMock = vi.fn()
    closeModalMock = vi.fn()
    updateModalDataMock = vi.fn()
    withProcessingMock = vi.fn(async cb => await cb())
    editRealizationMock = vi.fn().mockResolvedValue(undefined)
    deleteRealizationMock = vi.fn().mockResolvedValue(undefined)
    vi.clearAllMocks()
  })

  it('opens edit modal seeded with the row data and the row concept title', async () => {
    const user = userEvent.setup()
    renderEditHarness()

    await user.click(screen.getByRole('button', { name: 'Open Edit' }))

    expect(createModalMock).toHaveBeenCalledTimes(1)
    const modalConfig = createModalMock.mock.calls[0][0]

    expect(modalConfig.data).toEqual({
      confirmDiscard: false,
      confirmCommit: false,
      hasChanges: false,
      isDuplicate: false,
      isValid: true,
      isValidToConcept: true,
      original: REALIZATION,
      realization: { ...REALIZATION },
    })

    mockModalData = { realization: REALIZATION }
    render(<modalConfig.titleComponent />)
    expect(screen.getByText(`Concept: ${REALIZATION.concept}`)).toBeInTheDocument()
  })

  it('enters save confirmation state on first save click in edit modal', async () => {
    const user = userEvent.setup()
    renderEditHarness()

    await user.click(screen.getByRole('button', { name: 'Open Edit' }))
    expect(createModalMock).toHaveBeenCalledTimes(1)
    const modalConfig = createModalMock.mock.calls[0][0]

    mockModalData = {
      confirmCommit: false,
      confirmDiscard: false,
      hasChanges: true,
      isDuplicate: false,
      isValid: true,
      isValidToConcept: true,
      original: REALIZATION,
      realization: { ...REALIZATION, linkValue: 'squid' },
    }

    render(<modalConfig.actionsComponent />)

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.SAVE }))

    expect(updateModalDataMock).toHaveBeenCalledWith({
      confirmCommit: true,
      alert: {
        lines: CONFIG.PANELS.REALIZATIONS.MODALS.EDIT.ALERT.SAVE_CONFIRM.LINES,
        severity: CONFIG.PANELS.REALIZATIONS.MODALS.EDIT.ALERT.SAVE_CONFIRM.SEVERITY,
      },
    })
    expect(editRealizationMock).not.toHaveBeenCalled()
  })

  it('commits edit with only the changed fields on second save click, then closes', async () => {
    const user = userEvent.setup()
    renderEditHarness()

    await user.click(screen.getByRole('button', { name: 'Open Edit' }))
    const modalConfig = createModalMock.mock.calls[0][0]

    mockModalData = {
      confirmCommit: true,
      confirmDiscard: false,
      hasChanges: true,
      isDuplicate: false,
      isValid: true,
      isValidToConcept: true,
      original: REALIZATION,
      realization: { ...REALIZATION, linkValue: 'squid' },
    }

    render(<modalConfig.actionsComponent />)

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.SAVE }))

    expect(editRealizationMock).toHaveBeenCalledWith(REALIZATION, { linkValue: 'squid' })
    expect(closeModalMock).toHaveBeenCalled()
  })

  it('closes edit modal without saving when cancel is clicked in save confirmation step', async () => {
    const user = userEvent.setup()
    renderEditHarness()

    await user.click(screen.getByRole('button', { name: 'Open Edit' }))
    const modalConfig = createModalMock.mock.calls[0][0]

    mockModalData = {
      confirmCommit: true,
      confirmDiscard: false,
      hasChanges: true,
      isDuplicate: false,
      isValid: true,
      isValidToConcept: true,
      original: REALIZATION,
      realization: { ...REALIZATION, linkValue: 'squid' },
    }

    render(<modalConfig.actionsComponent />)

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.CANCEL }))

    expect(updateModalDataMock).toHaveBeenCalledWith({
      confirmCommit: false,
      alert: null,
      confirmDiscard: false,
    })
    expect(closeModalMock).toHaveBeenCalledWith(false)
    expect(editRealizationMock).not.toHaveBeenCalled()
  })

  it('closes edit modal without saving when cancel is clicked with no changes', async () => {
    const user = userEvent.setup()
    renderEditHarness()

    await user.click(screen.getByRole('button', { name: 'Open Edit' }))
    const modalConfig = createModalMock.mock.calls[0][0]

    mockModalData = {
      confirmCommit: false,
      confirmDiscard: false,
      hasChanges: false,
      isDuplicate: false,
      isValid: true,
      isValidToConcept: true,
      original: REALIZATION,
      realization: { ...REALIZATION },
    }

    render(<modalConfig.actionsComponent />)

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.CANCEL }))

    expect(closeModalMock).toHaveBeenCalledWith(false)
    expect(editRealizationMock).not.toHaveBeenCalled()
  })

  it('requires a second delete click to confirm, then deletes and closes', async () => {
    const user = userEvent.setup()
    renderDeleteHarness()

    await user.click(screen.getByRole('button', { name: 'Open Delete' }))
    expect(createModalMock).toHaveBeenCalledTimes(1)
    const modalConfig = createModalMock.mock.calls[0][0]

    mockModalData = {
      alert: null,
      confirmDelete: false,
      realization: REALIZATION,
    }

    const firstRender = render(<modalConfig.actionsComponent />)

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.DELETE }))

    expect(updateModalDataMock).toHaveBeenCalledWith({
      confirmDelete: true,
      alert: {
        lines: CONFIG.PANELS.REALIZATIONS.MODALS.DELETE.CONTENT.CONFIRM_WARNING,
        severity: CONFIG.PANELS.REALIZATIONS.MODALS.DELETE.ALERT.CONFIRM_WARNING.SEVERITY,
      },
    })
    expect(deleteRealizationMock).not.toHaveBeenCalled()

    firstRender.unmount()

    mockModalData = {
      alert: null,
      confirmDelete: true,
      realization: REALIZATION,
    }

    render(<modalConfig.actionsComponent />)

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.DELETE }))

    expect(deleteRealizationMock).toHaveBeenCalledWith(REALIZATION)
    expect(closeModalMock).toHaveBeenCalled()
  })

  it('closes delete modal when cancel is clicked in delete confirmation step', async () => {
    const user = userEvent.setup()
    renderDeleteHarness()

    await user.click(screen.getByRole('button', { name: 'Open Delete' }))
    const modalConfig = createModalMock.mock.calls[0][0]

    mockModalData = {
      confirmDelete: true,
      realization: REALIZATION,
    }

    render(<modalConfig.actionsComponent />)

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.CANCEL }))

    expect(updateModalDataMock).toHaveBeenCalledWith({ confirmDelete: false, alert: null })
    expect(closeModalMock).toHaveBeenCalled()
    expect(deleteRealizationMock).not.toHaveBeenCalled()
  })

  it('replaces delete warning text with confirm warning text on second step', () => {
    const DeleteContent = createDeleteRealizationContent()
    const firstWarningLine = CONFIG.PANELS.REALIZATIONS.MODALS.DELETE.ALERT.WARNING.LINES[0]
    const firstConfirmLine = CONFIG.PANELS.REALIZATIONS.MODALS.DELETE.ALERT.CONFIRM_WARNING.LINES[0]

    const Wrapper = ({ confirmDelete }) => <DeleteContent realization={REALIZATION} confirmDelete={confirmDelete} />

    const { rerender } = render(<Wrapper confirmDelete={false} />)
    expect(screen.getByText(firstWarningLine)).toBeInTheDocument()
    expect(screen.queryByText(firstConfirmLine)).not.toBeInTheDocument()
    rerender(<Wrapper confirmDelete={true} />)
    expect(screen.getByText(firstConfirmLine)).toBeInTheDocument()
    expect(screen.queryByText(firstWarningLine)).not.toBeInTheDocument()
  })
})
