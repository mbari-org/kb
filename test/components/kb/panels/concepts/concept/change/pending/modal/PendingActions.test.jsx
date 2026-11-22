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
const { ALL } = CONFIG.PANELS.CONCEPTS.MODALS.CONCEPT

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

  it('offers only Close once the reject is blocked, keeping it in the middle slot', () => {
    renderPendingActions(null, { closeOnly: true })

    expect(screen.getAllByRole('button')).toHaveLength(1)
    const close = screen.getByRole('button', { name: CONFIG.BUTTON.CLOSE })
    const slots = close.parentElement.children
    expect(slots).toHaveLength(3)
    expect(slots[1]).toBe(close)
  })

  it('dismisses the blocked alert on Close without closing the modal', async () => {
    const spies = renderPendingActions(null, { closeOnly: true, alert: { lines: ['blocked'], severity: 'warning' } })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.CLOSE }))

    expect(spies.closeModal).not.toHaveBeenCalled()
    expect(spies.setModalData).toHaveBeenCalledTimes(1)
    const [update] = spies.setModalData.mock.calls[0]
    expect(update({ closeOnly: true, alert: { lines: ['blocked'] }, nameChangeType: 'rename' })).toEqual({
      closeOnly: false,
      alert: null,
      nameChangeType: 'rename',
    })
  })

  it.each([
    [{ approval: PENDING.APPROVAL.ACCEPT, group: ALL, pendingIds: ['p1'] }, CONFIG.BUTTON.REJECT_ALL],
    [{ approval: PENDING.APPROVAL.ACCEPT, pendingIds: ['p1'] }, CONFIG.BUTTON.REJECT],
    [{ approval: PENDING.APPROVAL.REJECT, group: ALL, pendingIds: ['p1'] }, CONFIG.BUTTON.APPROVE_ALL],
    [{ approval: PENDING.APPROVAL.REJECT, pendingIds: ['p1'] }, CONFIG.BUTTON.APPROVE],
  ])('hides the opposing action and keeps the other buttons in place', (pendingConfirm, hiddenLabel) => {
    renderPendingActions(pendingConfirm)

    const close = screen.getByRole('button', { name: CONFIG.BUTTON.CLOSE })
    const slots = close.parentElement.children
    expect(screen.queryByRole('button', { name: hiddenLabel })).not.toBeInTheDocument()
    expect(slots).toHaveLength(3)
    expect(slots[1]).toBe(close)
    expect(Array.from(slots).filter(slot => slot.textContent === '')).toHaveLength(1)
  })
})
