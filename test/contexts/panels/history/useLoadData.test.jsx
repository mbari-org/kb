import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import useLoadData from '@/contexts/panels/history/useLoadData'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { PAGINATION } from '@/lib/constants/pagination'
import { SELECTED } from '@/lib/constants/selected'
import { CONCEPT } from '@/lib/constants'
import { getConceptHistory } from '@/lib/api/history'

const { DEFAULT_LIMIT } = PAGINATION.HISTORY

const { mockGetDescendantNames } = vi.hoisted(() => ({
  mockGetDescendantNames: vi.fn(),
}))

vi.mock('@/lib/model/concept', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    getDescendantNames: (...args) => mockGetDescendantNames(...args),
  }
})

const createWrapper = ({
  selectedType = SELECTED.SETTINGS.HISTORY.TYPES.PENDING,
  selectedConcept = 'dingo',
  getConcept = vi.fn(() => null),
} = {}) => {
  const getSelected = key => (key === SELECTED.CONCEPT ? selectedConcept : null)
  const getSettings = (key, subKey) => {
    if (key === SELECTED.SETTINGS.HISTORY.KEY && subKey === SELECTED.SETTINGS.HISTORY.TYPE) {
      return selectedType
    }
    return undefined
  }

  const Wrapper = ({ children }) => (
    <SelectedContext.Provider value={{ getSelected, getSettings }}>
      <TaxonomyContext.Provider value={{ getConcept }}>
        {children}
      </TaxonomyContext.Provider>
    </SelectedContext.Provider>
  )

  Wrapper.displayName = 'UseLoadDataTestWrapper'
  return Wrapper
}

describe('useLoadData pending history', () => {
  it('loads pending history from context and resets pagination before slicing page data', async () => {
    const pendingHistory = Array.from({ length: DEFAULT_LIMIT + 10 }, (_, index) => ({
      id: index + 1,
      field: 'name',
    }))

    const apiFns = {
      apiPayload: vi.fn(),
      apiResult: vi.fn(),
      apiRaw: vi.fn(),
    }

    const updateConceptState = vi.fn()
    const updatePageState = vi.fn()

    const { result } = renderHook(
      () =>
        useLoadData({
          apiFns,
          conceptHistoryExtent: CONCEPT.EXTENT.SOLO,
          pendingHistory,
        }),
      { wrapper: createWrapper({ selectedType: SELECTED.SETTINGS.HISTORY.TYPES.PENDING }) }
    )

    await act(async () => {
      await result.current({ updateConceptState, updatePageState })
    })

    expect(updatePageState).toHaveBeenNthCalledWith(1, { limit: DEFAULT_LIMIT, offset: 0 })
    expect(updateConceptState).toHaveBeenCalledWith({
      data: pendingHistory,
      count: pendingHistory.length,
    })
    expect(updatePageState).toHaveBeenNthCalledWith(2, {
      data: pendingHistory.slice(0, DEFAULT_LIMIT),
    })
    expect(apiFns.apiPayload).not.toHaveBeenCalled()
    expect(apiFns.apiResult).not.toHaveBeenCalled()
  })

  it('keeps full pending list in first page when pending history is under default limit', async () => {
    const pendingHistory = [
      { id: 1, field: 'name' },
      { id: 2, field: 'parent' },
    ]
    const apiFns = {
      apiPayload: vi.fn(),
      apiResult: vi.fn(),
      apiRaw: vi.fn(),
    }
    const updateConceptState = vi.fn()
    const updatePageState = vi.fn()

    const { result } = renderHook(
      () =>
        useLoadData({
          apiFns,
          conceptHistoryExtent: CONCEPT.EXTENT.SOLO,
          pendingHistory,
        }),
      { wrapper: createWrapper({ selectedType: SELECTED.SETTINGS.HISTORY.TYPES.PENDING }) }
    )

    await act(async () => {
      await result.current({ updateConceptState, updatePageState })
    })

    expect(updateConceptState).toHaveBeenCalledWith({
      data: pendingHistory,
      count: pendingHistory.length,
    })
    expect(updatePageState).toHaveBeenLastCalledWith({ data: pendingHistory })
  })
})

describe('useLoadData concept history', () => {
  it('loads concept history for the selected concept and resets pagination', async () => {
    const conceptHistory = Array.from({ length: DEFAULT_LIMIT + 5 }, (_, index) => ({
      id: index + 1,
      field: 'name',
    }))
    const apiFns = {
      apiPayload: vi.fn(async (fn, conceptName) => {
        if (fn === getConceptHistory && conceptName === 'dingo') {
          return conceptHistory
        }
        return []
      }),
      apiResult: vi.fn(),
      apiRaw: vi.fn(),
    }
    const updateConceptState = vi.fn()
    const updatePageState = vi.fn()

    const { result } = renderHook(
      () =>
        useLoadData({
          apiFns,
          conceptHistoryExtent: CONCEPT.EXTENT.SOLO,
          pendingHistory: [],
        }),
      { wrapper: createWrapper({ selectedType: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT }) }
    )

    await act(async () => {
      await result.current({ updateConceptState, updatePageState })
    })

    expect(updatePageState).toHaveBeenNthCalledWith(1, { limit: DEFAULT_LIMIT, offset: 0 })
    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptHistory, 'dingo')
    expect(updateConceptState).toHaveBeenCalledWith({
      data: conceptHistory,
      count: conceptHistory.length,
    })
    expect(updatePageState).toHaveBeenNthCalledWith(2, {
      data: conceptHistory.slice(0, DEFAULT_LIMIT),
    })
  })

  it('loads concept and child histories when extent is children', async () => {
    const selected = [{ id: 'dingo-1' }]
    const childA = [{ id: 'pup-1' }]
    const childB = [{ id: 'pack-1' }]
    const merged = [...selected, ...childA, ...childB]
    const apiFns = {
      apiPayload: vi.fn(async (_fn, conceptName) => {
        if (conceptName === 'dingo') {
          return selected
        } else if (conceptName === 'pup') {
          return childA
        } else if (conceptName === 'pack') {
          return childB
        } else {
          return []
        }
      }),
      apiResult: vi.fn(),
      apiRaw: vi.fn(),
    }
    const updateConceptState = vi.fn()
    const updatePageState = vi.fn()

    const getConcept = vi.fn(name => {
      if (name === 'dingo') {
        return { children: ['pup', 'pack'] }
      }
      return null
    })

    const { result } = renderHook(
      () =>
        useLoadData({
          apiFns,
          conceptHistoryExtent: CONCEPT.EXTENT.CHILDREN,
          pendingHistory: [],
        }),
      {
        wrapper: createWrapper({
          selectedType: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT,
          getConcept,
        }),
      }
    )

    await act(async () => {
      await result.current({ updateConceptState, updatePageState })
    })

    expect(updatePageState).toHaveBeenNthCalledWith(1, { limit: DEFAULT_LIMIT, offset: 0 })
    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptHistory, 'dingo')
    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptHistory, 'pup')
    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptHistory, 'pack')
    expect(updateConceptState).toHaveBeenCalledWith({
      data: merged,
      count: merged.length,
    })
    expect(updatePageState).toHaveBeenNthCalledWith(2, {
      data: merged.slice(0, DEFAULT_LIMIT),
    })
  })

  it('loads concept and descendants histories using descendant names when extent is descendants', async () => {
    mockGetDescendantNames.mockResolvedValueOnce(['pup', 'pack'])
    const payloadByName = {
      dingo: [{ id: 'dingo-1' }],
      pup: [{ id: 'pup-1' }],
      pack: [{ id: 'pack-1' }],
    }
    const merged = [...payloadByName.dingo, ...payloadByName.pup, ...payloadByName.pack]

    const apiFns = {
      apiPayload: vi.fn(),
      apiResult: vi.fn(),
      apiRaw: vi.fn(async (_fn, conceptName) => ({
        error: null,
        payload: payloadByName[conceptName] || [],
      })),
    }
    const updateConceptState = vi.fn()
    const updatePageState = vi.fn()

    const { result } = renderHook(
      () =>
        useLoadData({
          apiFns,
          conceptHistoryExtent: CONCEPT.EXTENT.DESCENDANTS,
          pendingHistory: [],
        }),
      { wrapper: createWrapper({ selectedType: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT }) }
    )

    await act(async () => {
      await result.current({ updateConceptState, updatePageState })
    })

    expect(updatePageState).toHaveBeenNthCalledWith(1, { limit: DEFAULT_LIMIT, offset: 0 })
    expect(mockGetDescendantNames).toHaveBeenCalledWith(apiFns, 'dingo')
    expect(apiFns.apiRaw).toHaveBeenCalledWith(getConceptHistory, 'dingo')
    expect(apiFns.apiRaw).toHaveBeenCalledWith(getConceptHistory, 'pup')
    expect(apiFns.apiRaw).toHaveBeenCalledWith(getConceptHistory, 'pack')
    expect(updateConceptState).toHaveBeenCalledWith({
      data: merged,
      count: merged.length,
    })
    expect(updatePageState).toHaveBeenNthCalledWith(2, {
      data: merged.slice(0, DEFAULT_LIMIT),
    })
  })
})
