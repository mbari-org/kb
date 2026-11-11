import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useHistoryUpdatePending from '@/contexts/panels/history/useHistoryUpdatePending'

const processPendingApprovalMock = vi.fn()

vi.mock('@/lib/concept/pending/processPendingApproval', () => ({
  default: (...args) => processPendingApprovalMock(...args),
}))

const buildWrapper = ({ pendingHistory = [] }) => {
  const wrapper = ({ children }) => (
    <ConfigContext.Provider value={{ apiFns: { apiPayload: vi.fn() } }}>
      <PanelDataContext.Provider
        value={{ pendingHistory, refreshData: vi.fn(), reloadConceptRealizations: vi.fn() }}
      >
        <SelectedContext.Provider value={{ concepts: { removeName: vi.fn() }, updateSelected: vi.fn() }}>
          <TaxonomyContext.Provider
            value={{ conceptEditsRefresh: vi.fn(), getConcept: vi.fn(), loadConcept: vi.fn() }}
          >
            <ConceptContext.Provider value={{ resetConceptPaths: vi.fn() }}>
              {children}
            </ConceptContext.Provider>
          </TaxonomyContext.Provider>
        </SelectedContext.Provider>
      </PanelDataContext.Provider>
    </ConfigContext.Provider>
  )

  return { wrapper }
}

describe('useHistoryUpdatePending', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      pendingHistory: [],
      updated: [],
    }))
  })

  const deleteItem = {
    id: 'p9',
    concept: 'root',
    field: 'Concept.child',
    action: 'Delete',
    oldValue: 'doomed-concept',
  }

  it('rejects the deleted concept\'s other pending items before approving its delete', async () => {
    const mediaItem = { id: 'p1', concept: 'doomed-concept', field: 'Media', action: 'Edit' }
    const rankItem = { id: 'p2', concept: 'doomed-concept', field: 'Rank', action: 'Edit' }
    const unrelatedItem = { id: 'p3', concept: 'other-concept', field: 'Rank', action: 'Edit' }

    const { wrapper } = buildWrapper({ pendingHistory: [mediaItem, rankItem, unrelatedItem, deleteItem] })

    const { result } = renderHook(() => useHistoryUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'approve', item: deleteItem })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(2)
    expect(processPendingApprovalMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        approval: 'reject',
        items: [mediaItem, rankItem],
      })
    )
    expect(processPendingApprovalMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        approval: 'approve',
        items: [deleteItem],
      })
    )
  })

  it('approves a delete without a reject phase when the concept has no other pending items', async () => {
    const { wrapper } = buildWrapper({ pendingHistory: [deleteItem] })

    const { result } = renderHook(() => useHistoryUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'approve', item: deleteItem })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'approve',
        items: [deleteItem],
      })
    )
  })

  it('rejects a delete with no side effects on other pending items', async () => {
    const mediaItem = { id: 'p1', concept: 'doomed-concept', field: 'Media', action: 'Edit' }

    const { wrapper } = buildWrapper({ pendingHistory: [mediaItem, deleteItem] })

    const { result } = renderHook(() => useHistoryUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'reject', item: deleteItem })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'reject',
        items: [deleteItem],
      })
    )
  })

  it('acts only on a non-delete pending item', async () => {
    const mediaItem = { id: 'p1', concept: 'doomed-concept', field: 'Media', action: 'Edit' }

    const { wrapper } = buildWrapper({ pendingHistory: [mediaItem, deleteItem] })

    const { result } = renderHook(() => useHistoryUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'approve', item: mediaItem })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'approve',
        items: [mediaItem],
      })
    )
  })
})
