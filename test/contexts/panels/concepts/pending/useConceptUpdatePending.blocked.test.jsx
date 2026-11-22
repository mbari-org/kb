import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useConceptUpdatePending from '@/contexts/panels/concepts/pending/useConceptUpdatePending'

import { createRenameRejectBlocked, RENAME_REJECT_REASON } from '@/lib/concept/pending/renameRejectBlocked'
import { PENDING } from '@/lib/constants/pending.js'

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

const buildWrapper = withProcessing => {
  const staleConcept = { name: 'dingo-2', parent: 'root' }
  const pending = vi.fn(key => (key === PENDING.DATA.CONCEPT ? [renameItem] : []))

  const Wrapper = ({ children }) => (
    <ConfigContext.Provider value={{ apiFns: { apiPayload: vi.fn() } }}>
      <PanelDataContext.Provider
        value={{
          getReferences: vi.fn(() => []),
          pendingHistory: [renameItem],
          refreshData: vi.fn(),
          reloadConceptRealizations: vi.fn(),
        }}
      >
        <SelectedContext.Provider value={{ concepts: { removeName: vi.fn() }, updateSelected: vi.fn() }}>
          <TaxonomyContext.Provider
            value={{
              closestConcept: vi.fn(),
              conceptEditsRefresh: vi.fn(),
              getConcept: vi.fn(),
              isDescendant: vi.fn(() => false),
              loadConcept: vi.fn(),
            }}
          >
            <ConceptModalContext.Provider value={{ withProcessing }}>
              <ConceptContext.Provider value={{ concept: staleConcept, pending, setConcept: vi.fn() }}>
                {children}
              </ConceptContext.Provider>
            </ConceptModalContext.Provider>
          </TaxonomyContext.Provider>
        </SelectedContext.Provider>
      </PanelDataContext.Provider>
    </ConfigContext.Provider>
  )

  return Wrapper
}

describe('useConceptUpdatePending blocked rename reject', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rethrows the blocked reject so the modal can show the reason', async () => {
    processPendingApprovalMock.mockRejectedValueOnce(
      createRenameRejectBlocked(RENAME_REJECT_REASON.CONCEPT_ADDED, 'dingo')
    )
    const withProcessing = vi.fn(async work => work())
    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper: buildWrapper(withProcessing) })

    await act(async () => {
      await expect(result.current({ approval: 'reject', pendingIds: ['p1'] })).rejects.toMatchObject({
        title: 'Rename Reject Blocked',
      })
    })

    expect(showBoundaryMock).not.toHaveBeenCalled()
  })
})
