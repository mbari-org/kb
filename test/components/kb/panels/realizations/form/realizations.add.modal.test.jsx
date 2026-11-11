import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useAddRealizationButton from '@/components/kb/panels/realizations/form/useAddRealizationButton'
import { duplicateAddRealizationAlert } from '@/components/kb/panels/realizations/form/realizationModalUtils'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import CONFIG from '@/lib/config'

let mockModalData = null
let createModalMock
let closeModalMock
let updateModalDataMock
let withProcessingMock
let addRealizationMock

vi.mock('@/components/common/panel/PanelAddButton', () => ({
  default: ({ onClick, disabled, label }) => (
    <button disabled={disabled} onClick={onClick} type='button'>
      {label}
    </button>
  ),
}))

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

const EMPTY_WITH_CONCEPT = { concept: 'dingo', linkName: '', toConcept: '', linkValue: '' }
const FILLED_REALIZATION = { concept: 'dingo', linkName: 'eats', toConcept: 'nil', linkValue: 'fish' }

const AddButtonHarness = () => {
  const AddRealizationButton = useAddRealizationButton()
  return AddRealizationButton()
}

const renderAddHarness = (filters = { concept: 'dingo' }) => {
  const realizationsValue = {
    addRealization: addRealizationMock,
    filters,
  }
  const panelDataValue = { getConceptRealizations: vi.fn(() => []), pendingHistory: [] }

  return render(
    <TaxonomyContext.Provider value={{ loadConcept: vi.fn() }}>
      <PanelDataContext.Provider value={panelDataValue}>
        <RealizationsContext.Provider value={realizationsValue}>
          <AddButtonHarness />
        </RealizationsContext.Provider>
      </PanelDataContext.Provider>
    </TaxonomyContext.Provider>
  )
}

describe('Realizations add modal confirmation flows', () => {
  beforeEach(() => {
    mockModalData = null
    createModalMock = vi.fn()
    closeModalMock = vi.fn()
    updateModalDataMock = vi.fn()
    withProcessingMock = vi.fn(async cb => await cb())
    addRealizationMock = vi.fn().mockResolvedValue(undefined)
    vi.clearAllMocks()
  })

  it('opens add modal seeded with the filter concept and renders the concept title', async () => {
    const user = userEvent.setup()
    renderAddHarness()

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.ADD }))

    expect(createModalMock).toHaveBeenCalledTimes(1)
    const modalConfig = createModalMock.mock.calls[0][0]

    expect(modalConfig.data).toEqual({
      confirmDiscard: false,
      confirmCommit: false,
      hasChanges: false,
      isDuplicate: false,
      isValid: false,
      isValidToConcept: true,
      original: { ...EMPTY_WITH_CONCEPT },
      realization: { ...EMPTY_WITH_CONCEPT },
    })

    mockModalData = { realization: { ...EMPTY_WITH_CONCEPT } }
    render(<modalConfig.titleComponent />)
    expect(screen.getByText('Concept: dingo')).toBeInTheDocument()
  })

  it('disables the add button when no concept filter is selected', () => {
    renderAddHarness({})

    expect(screen.getByRole('button', { name: CONFIG.BUTTON.ADD })).toBeDisabled()
  })

  it('enters save confirmation state on first save click in add modal', async () => {
    const user = userEvent.setup()
    renderAddHarness()

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.ADD }))
    const modalConfig = createModalMock.mock.calls[0][0]

    mockModalData = {
      confirmCommit: false,
      confirmDiscard: false,
      hasChanges: true,
      isDuplicate: false,
      isValid: true,
      isValidToConcept: true,
      original: { ...EMPTY_WITH_CONCEPT },
      realization: { ...FILLED_REALIZATION },
    }

    render(<modalConfig.actionsComponent />)

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.SAVE }))

    expect(updateModalDataMock).toHaveBeenCalledWith({
      confirmCommit: true,
      alert: {
        lines: CONFIG.PANELS.REALIZATIONS.MODALS.ADD.ALERT.SAVE_CONFIRM.LINES,
        severity: CONFIG.PANELS.REALIZATIONS.MODALS.ADD.ALERT.SAVE_CONFIRM.SEVERITY,
      },
    })
    expect(addRealizationMock).not.toHaveBeenCalled()
  })

  it('commits add with only the realization fields on second save click, then closes', async () => {
    const user = userEvent.setup()
    renderAddHarness()

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.ADD }))
    const modalConfig = createModalMock.mock.calls[0][0]

    mockModalData = {
      confirmCommit: true,
      confirmDiscard: false,
      hasChanges: true,
      isDuplicate: false,
      isValid: true,
      isValidToConcept: true,
      original: { ...EMPTY_WITH_CONCEPT },
      realization: { ...FILLED_REALIZATION, templateId: 't1' },
    }

    render(<modalConfig.actionsComponent />)

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.SAVE }))

    expect(addRealizationMock).toHaveBeenCalledWith(FILLED_REALIZATION)
    expect(closeModalMock).toHaveBeenCalledWith(true)
  })

  it('closes add modal without saving when cancel is clicked in save confirmation step', async () => {
    const user = userEvent.setup()
    renderAddHarness()

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.ADD }))
    const modalConfig = createModalMock.mock.calls[0][0]

    mockModalData = {
      confirmCommit: true,
      confirmDiscard: false,
      hasChanges: true,
      isDuplicate: false,
      isValid: true,
      isValidToConcept: true,
      original: { ...EMPTY_WITH_CONCEPT },
      realization: { ...FILLED_REALIZATION },
    }

    render(<modalConfig.actionsComponent />)

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.CANCEL }))

    expect(updateModalDataMock).toHaveBeenCalledWith({
      confirmCommit: false,
      alert: null,
      confirmDiscard: false,
    })
    expect(closeModalMock).toHaveBeenCalledWith(false)
    expect(addRealizationMock).not.toHaveBeenCalled()
  })

  it('disables save in confirmation step when the realization is a duplicate', async () => {
    const user = userEvent.setup()
    renderAddHarness()

    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.ADD }))
    const modalConfig = createModalMock.mock.calls[0][0]

    mockModalData = {
      confirmCommit: true,
      confirmDiscard: false,
      hasChanges: true,
      isDuplicate: true,
      isValid: true,
      isValidToConcept: true,
      original: { ...EMPTY_WITH_CONCEPT },
      realization: { ...FILLED_REALIZATION },
    }

    render(<modalConfig.actionsComponent />)

    expect(screen.getByRole('button', { name: CONFIG.BUTTON.SAVE })).toBeDisabled()
  })

  it('duplicate alert uses add modal config', () => {
    expect(duplicateAddRealizationAlert()).toEqual({
      lines: CONFIG.PANELS.REALIZATIONS.MODALS.ADD.ALERT.DUPLICATE.LINES,
      severity: CONFIG.PANELS.REALIZATIONS.MODALS.ADD.ALERT.DUPLICATE.SEVERITY,
    })
  })
})
