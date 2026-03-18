import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useAddTemplateButton from '@/components/kb/panels/templates/form/useAddTemplateButton'
import useDeleteTemplateButton from '@/components/kb/panels/templates/form/useDeleteTemplateButton'
import { createDeleteTemplateContent } from '@/components/kb/panels/templates/form/templateModalUtils'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import CONFIG from '@/text'

let mockModalData = null
let createModalMock
let closeModalMock
let updateModalDataMock
let withProcessingMock

vi.mock('@/components/common/panel/PanelAddButton', () => ({
  default: ({ onClick, label }) => (
    <button onClick={onClick} type='button'>
      {label}
    </button>
  ),
}))

vi.mock('@/contexts/panels/templates/modal', () => ({
  useTemplatesModalOperationsContext: () => ({
    closeModal: closeModalMock,
    createModal: createModalMock,
    updateModalData: updateModalDataMock,
    withProcessing: withProcessingMock,
  }),
  useTemplatesModalDataContext: () => ({
    modalData: mockModalData,
  }),
}))

vi.mock('react-error-boundary', () => ({
  useErrorBoundary: () => ({
    showBoundary: vi.fn(),
  }),
}))

const AddButtonHarness = () => {
  const AddTemplateButton = useAddTemplateButton()
  return <AddTemplateButton />
}

const DeleteButtonHarness = ({ template }) => {
  const openDeleteModal = useDeleteTemplateButton()
  return (
    <button onClick={() => openDeleteModal(template)} type='button'>
      Open Delete
    </button>
  )
}

const renderAddHarness = () => {
  const templatesValue = {
    addTemplate: vi.fn().mockResolvedValue(undefined),
    filters: { concept: 'dingo' },
  }
  const panelDataValue = { templates: [] }

  return render(
    <PanelDataContext.Provider value={panelDataValue}>
      <TemplatesContext.Provider value={templatesValue}>
        <AddButtonHarness />
      </TemplatesContext.Provider>
    </PanelDataContext.Provider>
  )
}

const renderDeleteHarness = () => {
  const templatesValue = {
    deleteTemplate: vi.fn().mockResolvedValue(undefined),
  }
  const panelDataValue = { templates: [] }
  const template = {
    id: 1,
    concept: 'dingo',
    linkName: 'eats',
    toConcept: 'nil',
    linkValue: 'fish',
  }

  return render(
    <PanelDataContext.Provider value={panelDataValue}>
      <TemplatesContext.Provider value={templatesValue}>
        <DeleteButtonHarness template={template} />
      </TemplatesContext.Provider>
    </PanelDataContext.Provider>
  )
}

describe('Templates modal confirmation flows', () => {
  beforeEach(() => {
    mockModalData = null
    createModalMock = vi.fn()
    closeModalMock = vi.fn()
    updateModalDataMock = vi.fn()
    withProcessingMock = vi.fn(async cb => await cb())
    vi.clearAllMocks()
  })

  it('closes add modal when cancel is clicked in save confirmation step', async () => {
    const user = userEvent.setup()
    renderAddHarness()

    await user.click(screen.getByRole('button', { name: CONFIG.PANELS.TEMPLATES.BUTTON.ADD }))

    expect(createModalMock).toHaveBeenCalledTimes(1)
    const modalConfig = createModalMock.mock.calls[0][0]

    mockModalData = {
      confirmCommit: true,
      confirmDiscard: false,
      hasChanges: true,
      isValid: true,
      template: {
        concept: 'dingo',
        linkName: 'eats',
        toConcept: 'nil',
        linkValue: 'fish',
      },
    }

    render(<modalConfig.actionsComponent />)

    await user.click(screen.getByRole('button', { name: CONFIG.PANELS.TEMPLATES.MODALS.BUTTON.CANCEL }))

    expect(updateModalDataMock).toHaveBeenCalledWith({
      confirmCommit: false,
      alert: null,
      confirmDiscard: false,
    })
    expect(closeModalMock).toHaveBeenCalledWith(false)
  })

  it('enters save confirmation state on first save click in add modal', async () => {
    const user = userEvent.setup()
    renderAddHarness()

    await user.click(screen.getByRole('button', { name: CONFIG.PANELS.TEMPLATES.BUTTON.ADD }))
    expect(createModalMock).toHaveBeenCalledTimes(1)
    const modalConfig = createModalMock.mock.calls[0][0]

    mockModalData = {
      confirmCommit: false,
      confirmDiscard: false,
      hasChanges: true,
      isValid: true,
      template: {
        concept: 'dingo',
        linkName: 'eats',
        toConcept: 'nil',
        linkValue: 'fish',
      },
    }

    render(<modalConfig.actionsComponent />)

    await user.click(screen.getByRole('button', { name: CONFIG.PANELS.TEMPLATES.MODALS.BUTTON.SAVE }))

    expect(updateModalDataMock).toHaveBeenCalledWith({
      confirmCommit: true,
      alert: {
        lines: CONFIG.PANELS.TEMPLATES.MODALS.ADD.ALERT.SAVE_CONFIRM.LINES,
        severity: CONFIG.PANELS.TEMPLATES.MODALS.ADD.ALERT.SAVE_CONFIRM.SEVERITY,
      },
    })
  })

  it('closes delete modal when cancel is clicked in delete confirmation step', async () => {
    const user = userEvent.setup()
    renderDeleteHarness()

    await user.click(screen.getByRole('button', { name: 'Open Delete' }))
    expect(createModalMock).toHaveBeenCalledTimes(1)
    const modalConfig = createModalMock.mock.calls[0][0]

    mockModalData = {
      confirmDelete: true,
      template: {
        id: 1,
        concept: 'dingo',
        linkName: 'eats',
        toConcept: 'nil',
        linkValue: 'fish',
      },
    }

    render(<modalConfig.actionsComponent />)

    await user.click(screen.getByRole('button', { name: CONFIG.PANELS.TEMPLATES.MODALS.BUTTON.CANCEL }))

    expect(updateModalDataMock).toHaveBeenCalledWith({ confirmDelete: false, alert: null })
    expect(closeModalMock).toHaveBeenCalled()
  })

  it('replaces delete warning text with confirm warning text on second step', () => {
    const DeleteContent = createDeleteTemplateContent()
    const template = {
      id: 1,
      concept: 'dingo',
      linkName: 'eats',
      toConcept: 'nil',
      linkValue: 'fish',
    }
    const firstWarningLine = CONFIG.PANELS.TEMPLATES.MODALS.DELETE.ALERT.WARNING.LINES[0]
    const firstConfirmLine = CONFIG.PANELS.TEMPLATES.MODALS.DELETE.ALERT.CONFIRM_WARNING.LINES[0]

    const Wrapper = ({ confirmDelete }) => <DeleteContent template={template} confirmDelete={confirmDelete} />

    const { rerender } = render(<Wrapper confirmDelete={false} />)
    expect(screen.getByText(firstWarningLine)).toBeInTheDocument()
    expect(screen.queryByText(firstConfirmLine)).not.toBeInTheDocument()
    rerender(<Wrapper confirmDelete={true} />)
    expect(screen.getByText(firstConfirmLine)).toBeInTheDocument()
    expect(screen.queryByText(firstWarningLine)).not.toBeInTheDocument()
  })
})
