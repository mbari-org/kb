import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import PendingActions from '@/components/kb/panels/concepts/concept/change/pending/modal/PendingActions'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import UserContext from '@/contexts/user/UserContext'

import {
  createRenameRejectBlocked,
  RENAME_REJECT_REASON,
  renameRejectLines,
} from '@/lib/concept/pending/renameRejectBlocked'
import { PENDING } from '@/lib/constants/pending.js'
import CONFIG from '@/lib/config'
import kbTheme from '@/lib/theme'

const updatePendingMock = vi.fn()

vi.mock('@/contexts/panels/concepts/pending/useConceptUpdatePending', () => ({
  default: () => updatePendingMock,
}))

const renderPendingActions = (pendingConfirm, modalData = {}) => {
  const spies = { closeModal: vi.fn(), setModalData: vi.fn(), setPendingConfirm: vi.fn() }
  const pending = vi.fn(key => (key === PENDING.DATA.CONFIRM ? pendingConfirm : []))

  render(
    <ThemeProvider theme={kbTheme}>
      <ConceptContext.Provider
        value={{ concept: { name: 'dingo-2' }, pending, setPendingConfirm: spies.setPendingConfirm }}
      >
        <ConceptStagedContext.Provider value={{ confirmReset: null }}>
          <ConceptModalContext.Provider value={{ closeModal: spies.closeModal, setModalData: spies.setModalData }}>
            <ConceptModalDataContext.Provider value={{ modalData }}>
              <UserContext.Provider value={{ isAdmin: true }}>
                <PendingActions />
              </UserContext.Provider>
            </ConceptModalDataContext.Provider>
          </ConceptModalContext.Provider>
        </ConceptStagedContext.Provider>
      </ConceptContext.Provider>
    </ThemeProvider>
  )

  return spies
}

describe('PendingActions rename reject', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the reason in the modal alert and keeps the modal open when the reject is blocked', async () => {
    const error = createRenameRejectBlocked(RENAME_REJECT_REASON.CONCEPT_ADDED, 'dingo')
    updatePendingMock.mockRejectedValueOnce(error)
    const spies = renderPendingActions({ approval: PENDING.APPROVAL.REJECT, group: 'item', pendingIds: ['p1'] })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.CONFIRM }))

    const alerts = spies.setModalData.mock.calls.map(([update]) => update({})).filter(data => data.alert)
    expect(alerts).toEqual([{ alert: { lines: renameRejectLines(error), severity: 'warning' }, closeOnly: true }])
    expect(spies.closeModal).not.toHaveBeenCalledWith(true)
    expect(spies.setPendingConfirm).toHaveBeenCalledWith(null)
  })

  it('offers only Close once the reject is blocked', () => {
    renderPendingActions(null, { closeOnly: true })

    expect(screen.getAllByRole('button')).toHaveLength(1)
    expect(screen.getByRole('button', { name: CONFIG.BUTTON.CLOSE })).toBeInTheDocument()
  })
})
