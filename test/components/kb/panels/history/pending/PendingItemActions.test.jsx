import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import PendingItemActions from '@/components/kb/panels/history/pending/PendingItemActions'

import {
  createRenameRejectBlocked,
  RENAME_REJECT_REASON,
  renameRejectLines,
} from '@/lib/concept/pending/renameRejectBlocked'
import CONFIG from '@/lib/config'
import kbTheme from '@/lib/theme'

const updatePendingMock = vi.fn()
const closeModalMock = vi.fn()

const renameItem = {
  id: 'p1',
  concept: 'dingo-2',
  field: 'ConceptName',
  action: 'Edit',
  oldValue: 'dingo',
  newValue: 'dingo-2',
}

vi.mock('@/contexts/panel/modal', () => ({
  usePanelModalDataContext: () => ({ modalData: { item: renameItem } }),
  usePanelModalOperationsContext: () => ({
    beginProcessing: () => vi.fn(),
    closeModal: closeModalMock,
  }),
}))

vi.mock('@/contexts/panels/history/useHistoryUpdatePending', () => ({
  default: () => updatePendingMock,
}))

describe('PendingItemActions rename reject', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the reason and offers only Close when the reject is blocked', async () => {
    const error = createRenameRejectBlocked(RENAME_REJECT_REASON.CONCEPT_ADDED, 'dingo')
    updatePendingMock.mockRejectedValueOnce(error)

    render(
      <ThemeProvider theme={kbTheme}>
        <PendingItemActions />
      </ThemeProvider>
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.REJECT }))
    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.CONFIRM }))

    await waitFor(() => renameRejectLines(error).forEach(line => expect(screen.getByText(line)).toBeInTheDocument()))
    expect(screen.getAllByRole('button')).toHaveLength(1)
    expect(screen.getByRole('button', { name: CONFIG.BUTTON.CLOSE })).toBeInTheDocument()
    expect(closeModalMock).not.toHaveBeenCalledWith(true)
  })
})
