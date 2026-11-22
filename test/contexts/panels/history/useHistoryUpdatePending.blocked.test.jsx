import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useHistoryUpdatePending from '@/contexts/panels/history/useHistoryUpdatePending'

import { createRenameRejectBlocked, RENAME_REJECT_REASON } from '@/lib/concept/pending/renameRejectBlocked'

const processPendingApprovalMock = vi.fn()
const showBoundaryMock = vi.fn()

vi.mock('react-error-boundary', () => ({
  useErrorBoundary: () => ({ showBoundary: showBoundaryMock }),
}))

vi.mock('@/lib/concept/pending/processPendingApproval', () => ({
  default: (...args) => processPendingApprovalMock(...args),
}))

const renameItem = {
  id: 'p1',
  concept: 'dingo-2',
  field: 'ConceptName',
  action: 'Edit',
  oldValue: 'dingo',
  newValue: 'dingo-2',
}

const wrapper = ({ children }) => (
  <ConfigContext.Provider value={{ apiFns: { apiPayload: vi.fn() } }}>
    <PanelDataContext.Provider
      value={{ getReferences: vi.fn(() => []), pendingHistory: [], refreshData: vi.fn(), reloadConceptRealizations: vi.fn() }}
    >
      <SelectedContext.Provider value={{ concepts: { removeName: vi.fn() }, updateSelected: vi.fn() }}>
        <TaxonomyContext.Provider value={{ conceptEditsRefresh: vi.fn(), getConcept: vi.fn(), loadConcept: vi.fn() }}>
          <ConceptContext.Provider value={{ resetConceptPaths: vi.fn() }}>{children}</ConceptContext.Provider>
        </TaxonomyContext.Provider>
      </SelectedContext.Provider>
    </PanelDataContext.Provider>
  </ConfigContext.Provider>
)

describe('useHistoryUpdatePending blocked rename reject', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rethrows the blocked reject so the modal can show the reason', async () => {
    processPendingApprovalMock.mockRejectedValueOnce(
      createRenameRejectBlocked(RENAME_REJECT_REASON.CONCEPT_ADDED, 'dingo')
    )
    const { result } = renderHook(() => useHistoryUpdatePending(), { wrapper })

    await act(async () => {
      await expect(result.current({ approval: 'reject', item: renameItem })).rejects.toMatchObject({
        title: 'Rename Reject Blocked',
      })
    })

    expect(showBoundaryMock).not.toHaveBeenCalled()
  })
})
