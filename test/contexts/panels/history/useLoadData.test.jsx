import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import useLoadData from '@/contexts/panels/history/useLoadData'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { PAGINATION } from '@/lib/constants/pagination'
import { SELECTED } from '@/lib/constants/selected'

const { DEFAULT_LIMIT } = PAGINATION.HISTORY

const createWrapper = ({ selectedType = SELECTED.SETTINGS.HISTORY.TYPES.PENDING } = {}) => {
  const getSelected = key => (key === SELECTED.CONCEPT ? 'dingo' : null)
  const getSettings = (key, subKey) => {
    if (key === SELECTED.SETTINGS.HISTORY.KEY && subKey === SELECTED.SETTINGS.HISTORY.TYPE) {
      return selectedType
    }
    return undefined
  }

  const Wrapper = ({ children }) => (
    <SelectedContext.Provider value={{ getSelected, getSettings }}>
      <TaxonomyContext.Provider value={{ getConcept: vi.fn(() => null) }}>
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
          conceptHistoryExtent: 'concept',
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
          conceptHistoryExtent: 'concept',
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
