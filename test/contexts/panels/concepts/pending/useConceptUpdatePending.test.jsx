import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useConceptUpdatePending from '@/contexts/panels/concepts/pending/useConceptUpdatePending'

import { PENDING } from '@/lib/constants/pending.js'
import CONFIG from '@/lib/config'

const processPendingApprovalMock = vi.fn()

vi.mock('@/lib/concept/pending/processPendingApproval', () => ({
  default: (...args) => processPendingApprovalMock(...args),
}))

const { PROCESSING } = CONFIG

describe('useConceptUpdatePending', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const buildWrapper = ({ conceptEditsRefresh, getConcept, pendingItems, refreshData, setConcept, updateSelected, withProcessing }) => {
    const staleConcept = { name: 'pending-concept' }
    const pending = vi.fn(key => (key === PENDING.DATA.CONCEPT ? pendingItems : []))

    const wrapper = ({ children }) => (
      <ConfigContext.Provider value={{ apiFns: { apiPayload: vi.fn() } }}>
        <PanelDataContext.Provider value={{ refreshData }}>
          <SelectedContext.Provider value={{ updateSelected }}>
            <TaxonomyContext.Provider value={{ conceptEditsRefresh, getConcept }}>
              <ConceptModalContext.Provider value={{ withProcessing }}>
                <ConceptContext.Provider value={{ concept: staleConcept, pending, setConcept }}>
                  {children}
                </ConceptContext.Provider>
              </ConceptModalContext.Provider>
            </TaxonomyContext.Provider>
          </SelectedContext.Provider>
        </PanelDataContext.Provider>
      </ConfigContext.Provider>
    )

    return { staleConcept, wrapper }
  }

  it('applies the optimistic concept returned by processPendingApproval', async () => {
    const pendingItem = { id: 'p1', concept: 'pending-concept' }
    const secondItem = { id: 'p2', concept: 'pending-concept' }
    const optimisticConcept = { name: 'pending-concept', parent: 'root' }
    const pendingHistory = [{ id: 'p1' }]

    const setConcept = vi.fn(async () => {})
    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: { 'pending-concept': optimisticConcept },
      pendingHistory,
      updated: ['pending-concept'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept: vi.fn(),
      pendingItems: [pendingItem, secondItem],
      refreshData: vi.fn(),
      setConcept,
      updateSelected: vi.fn(),
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    let remaining
    await act(async () => {
      remaining = await result.current({ approval: 'accept', pendingIds: ['p1'] })
    })

    expect(withProcessing).toHaveBeenCalledWith(
      expect.any(Function),
      PROCESSING.UPDATE,
      `${PROCESSING.ARG.PENDING}: accept`
    )
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'accept',
        items: [pendingItem],
      })
    )
    expect(setConcept).toHaveBeenCalledWith(optimisticConcept, pendingHistory)
    expect(remaining).toBe(true)
  })

  it('falls back to reloading the concept from taxonomy when no optimistic concept is returned', async () => {
    const pendingItem = { id: 'p1', concept: 'pending-concept' }
    const refreshedConcept = { name: 'pending-concept', parent: 'root' }
    const pendingHistory = []

    const getConcept = vi.fn(() => refreshedConcept)
    const setConcept = vi.fn(async () => {})
    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      pendingHistory,
      updated: ['pending-concept'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept,
      pendingItems: [pendingItem],
      refreshData: vi.fn(),
      setConcept,
      updateSelected: vi.fn(),
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    let remaining
    await act(async () => {
      remaining = await result.current({ approval: 'reject', pendingIds: ['p1'] })
    })

    expect(getConcept).toHaveBeenCalledWith('pending-concept')
    expect(setConcept).toHaveBeenCalledWith(refreshedConcept, pendingHistory)
    expect(remaining).toBe(false)
  })
})
