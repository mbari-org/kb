import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useHistoryUpdatePending from '@/contexts/panels/history/useHistoryUpdatePending'

const processPendingApprovalMock = vi.fn()
const relatedDataCountsMock = vi.fn()
const performReassignmentsMock = vi.fn()

vi.mock('@/lib/concept/pending/processPendingApproval', () => ({
  default: (...args) => processPendingApprovalMock(...args),
}))

vi.mock('@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts', () => ({
  performReassignments: (...args) => performReassignmentsMock(...args),
  relatedDataCounts: (...args) => relatedDataCountsMock(...args),
}))

const buildWrapper = ({ pendingHistory = [] }) => {
  const wrapper = ({ children }) => (
    <ConfigContext.Provider value={{ apiFns: { apiPayload: vi.fn() } }}>
      <PanelDataContext.Provider
        value={{ getReferences: vi.fn(() => []), pendingHistory, refreshData: vi.fn(), reloadConceptRealizations: vi.fn() }}
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

  it('approves a delete without acting on the concept\'s other pending items', async () => {
    const mediaItem = { id: 'p1', concept: 'doomed-concept', field: 'Media', action: 'Edit' }
    const rankItem = { id: 'p2', concept: 'doomed-concept', field: 'Rank', action: 'Edit' }
    const unrelatedItem = { id: 'p3', concept: 'other-concept', field: 'Rank', action: 'Edit' }

    const { wrapper } = buildWrapper({ pendingHistory: [mediaItem, rankItem, unrelatedItem, deleteItem] })

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

  it('rejects a pending add without acting on the concept\'s other pending items', async () => {
    const addItem = {
      id: 'p8',
      concept: 'root',
      field: 'Concept.child',
      action: 'Add',
      newValue: 'new-concept',
    }
    const mediaItem = { id: 'p1', concept: 'new-concept', field: 'Media', action: 'Edit' }

    const { wrapper } = buildWrapper({ pendingHistory: [addItem, mediaItem] })

    const { result } = renderHook(() => useHistoryUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'reject', item: addItem })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'reject',
        items: [addItem],
      })
    )
  })

  it('approves a pending add with no side effects on other pending items', async () => {
    const addItem = {
      id: 'p8',
      concept: 'root',
      field: 'Concept.child',
      action: 'Add',
      newValue: 'new-concept',
    }
    const mediaItem = { id: 'p1', concept: 'new-concept', field: 'Media', action: 'Edit' }

    const { wrapper } = buildWrapper({ pendingHistory: [addItem, mediaItem] })

    const { result } = renderHook(() => useHistoryUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'approve', item: addItem })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'approve',
        items: [addItem],
      })
    )
  })

  const renameItem = {
    id: 'p7',
    concept: 'dingo-2',
    field: 'ConceptName',
    action: 'Edit',
    oldValue: 'dingo',
    newValue: 'dingo-2',
  }

  it('reassigns related data after approving a rename with reassign extent', async () => {
    const counts = [{ title: 'Annotations', value: 2 }]
    relatedDataCountsMock.mockImplementation(async () => counts)

    const { wrapper } = buildWrapper({})

    const { result } = renderHook(() => useHistoryUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'approve', item: renameItem, nameChangeType: 'Reassign Related Data' })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(relatedDataCountsMock).toHaveBeenCalledWith(
      expect.objectContaining({ concept: { name: 'dingo-2' }, renamedFrom: 'dingo' })
    )
    expect(performReassignmentsMock).toHaveBeenCalledWith('dingo', 'dingo-2', counts)
  })

  it('does not reassign related data when the rename approval extent is name only', async () => {
    const { wrapper } = buildWrapper({})

    const { result } = renderHook(() => useHistoryUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'approve', item: renameItem, nameChangeType: 'Name Only' })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(performReassignmentsMock).not.toHaveBeenCalled()
  })

  it('does not reassign related data when a rename is rejected', async () => {
    const { wrapper } = buildWrapper({})

    const { result } = renderHook(() => useHistoryUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'reject', item: renameItem, nameChangeType: 'Reassign Related Data' })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(performReassignmentsMock).not.toHaveBeenCalled()
  })
})
