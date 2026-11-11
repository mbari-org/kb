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

  const buildWrapper = ({ closestConcept = vi.fn(), conceptEditsRefresh, getConcept, pendingHistory = [], pendingItems, parentPendingItems = [], refreshData, setConcept, updateSelected, withProcessing }) => {
    const staleConcept = { name: 'pending-concept', parent: 'root' }
    const pending = vi.fn(key => {
      if (key === PENDING.DATA.CONCEPT) return pendingItems
      if (key === PENDING.DATA.PARENT) return parentPendingItems
      return []
    })

    const wrapper = ({ children }) => (
      <ConfigContext.Provider value={{ apiFns: { apiPayload: vi.fn() } }}>
        <PanelDataContext.Provider value={{ pendingHistory, refreshData }}>
          <SelectedContext.Provider value={{ concepts: { removeName: vi.fn() }, updateSelected }}>
            <TaxonomyContext.Provider value={{ closestConcept, conceptEditsRefresh, getConcept, loadConcept: vi.fn() }}>
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
      deleted: [],
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
      deleted: [],
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

  it('resolves parent-owned child records and selects the parent when the concept was deleted', async () => {
    const childDeleteItem = {
      id: 'p9',
      concept: 'root',
      field: 'Concept.child',
      action: 'Delete',
      oldValue: 'pending-concept',
    }
    const pendingHistory = []

    const getConcept = vi.fn(() => null)
    const setConcept = vi.fn(async () => {})
    const updateSelected = vi.fn()
    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      deleted: ['pending-concept'],
      pendingHistory,
      updated: ['root'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept,
      pendingItems: [],
      parentPendingItems: [childDeleteItem],
      refreshData: vi.fn(),
      setConcept,
      updateSelected,
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    let remaining
    await act(async () => {
      remaining = await result.current({ approval: 'approve', pendingIds: ['p9'] })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'approve',
        items: [childDeleteItem],
      })
    )
    expect(setConcept).not.toHaveBeenCalled()
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'root' })
    expect(remaining).toBe(false)
  })

  it('rejects the concept\'s other pending items before approving its delete', async () => {
    const mediaItem = { id: 'p1', concept: 'pending-concept', field: 'Media', action: 'Edit' }
    const rankItem = { id: 'p2', concept: 'pending-concept', field: 'Rank', action: 'Edit' }
    const childDeleteItem = {
      id: 'p9',
      concept: 'root',
      field: 'Concept.child',
      action: 'Delete',
      oldValue: 'pending-concept',
    }

    const getConcept = vi.fn(() => null)
    const updateSelected = vi.fn()
    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      deleted: ['pending-concept'],
      pendingHistory: [],
      updated: ['root'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept,
      pendingHistory: [mediaItem, rankItem, childDeleteItem],
      pendingItems: [mediaItem, rankItem],
      parentPendingItems: [childDeleteItem],
      refreshData: vi.fn(),
      setConcept: vi.fn(async () => {}),
      updateSelected,
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    let remaining
    await act(async () => {
      remaining = await result.current({ approval: 'approve', pendingIds: ['p9'] })
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
        items: [childDeleteItem],
      })
    )
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'root' })
    expect(remaining).toBe(false)
  })

  it('approves all items with the delete approved last', async () => {
    const mediaItem = { id: 'p1', concept: 'pending-concept', field: 'Media', action: 'Edit' }
    const rankItem = { id: 'p2', concept: 'pending-concept', field: 'Rank', action: 'Edit' }
    const childDeleteItem = {
      id: 'p9',
      concept: 'root',
      field: 'Concept.child',
      action: 'Delete',
      oldValue: 'pending-concept',
    }

    const getConcept = vi.fn()
    const setConcept = vi.fn(async () => {})
    const updateSelected = vi.fn()
    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: { 'pending-concept': { name: 'pending-concept', parent: 'root' } },
      deleted: ['pending-concept'],
      pendingHistory: [],
      updated: ['pending-concept', 'root'],
    }))

    const { wrapper } = buildWrapper({
      closestConcept: vi.fn(() => ({ name: 'CDF' })),
      conceptEditsRefresh: vi.fn(),
      getConcept,
      pendingHistory: [mediaItem, rankItem, childDeleteItem],
      pendingItems: [mediaItem, rankItem],
      parentPendingItems: [childDeleteItem],
      refreshData: vi.fn(),
      setConcept,
      updateSelected,
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'approve', pendingIds: ['p9', 'p1', 'p2'] })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'approve',
        items: [mediaItem, rankItem, childDeleteItem],
      })
    )
    expect(setConcept).not.toHaveBeenCalled()
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'CDF' })
  })

  it('rejects all items with the delete rejected last', async () => {
    const mediaItem = { id: 'p1', concept: 'pending-concept', field: 'Media', action: 'Edit' }
    const rankItem = { id: 'p2', concept: 'pending-concept', field: 'Rank', action: 'Edit' }
    const childDeleteItem = {
      id: 'p9',
      concept: 'root',
      field: 'Concept.child',
      action: 'Delete',
      oldValue: 'pending-concept',
    }

    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      deleted: [],
      pendingHistory: [],
      updated: ['pending-concept', 'root'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept: vi.fn(),
      pendingHistory: [mediaItem, rankItem, childDeleteItem],
      pendingItems: [mediaItem, rankItem],
      parentPendingItems: [childDeleteItem],
      refreshData: vi.fn(),
      setConcept: vi.fn(async () => {}),
      updateSelected: vi.fn(),
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'reject', pendingIds: ['p9', 'p1', 'p2'] })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'reject',
        items: [mediaItem, rankItem, childDeleteItem],
      })
    )
  })
})
