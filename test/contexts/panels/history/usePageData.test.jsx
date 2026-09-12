import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import usePageData from '@/contexts/panels/history/usePageData'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
import { getHistory } from '@/lib/api/history'
import { SELECTED } from '@/lib/constants/selected'

const { HISTORY } = SELECTED.SETTINGS

const createWrapper = ({ selectedType, historySort }) => {
  const getSettings = (key, subKey) => {
    if (key === HISTORY.KEY) {
      if (subKey === HISTORY.TYPE) return selectedType
      if (subKey === HISTORY.SORT.KEY) return historySort
    }
    return undefined
  }

  const Wrapper = ({ children }) => (
    <SelectedSettingsContext.Provider value={{ getSettings }}>
      {children}
    </SelectedSettingsContext.Provider>
  )
  Wrapper.displayName = 'UsePageDataTestWrapper'
  return Wrapper
}

describe('usePageData', () => {
  it('uses paginated API history fetch for approved type with settings sort', async () => {
    const approvedData = [{ id: 1 }, { id: 2 }]
    const apiFns = {
      apiPaginated: vi.fn(async () => approvedData),
    }
    const updatePageState = vi.fn()
    const conceptState = { data: [] }
    const pageState = { limit: 25, offset: 50 }

    const { result } = renderHook(
      () =>
        usePageData({
          apiFns,
          conceptState,
          pageState,
        }),
      {
        wrapper: createWrapper({
          selectedType: HISTORY.TYPES.APPROVED,
          historySort: { approved: { field: 'creatorName', order: 'asc' } },
        }),
      }
    )

    await act(async () => {
      await result.current({ updatePageState })
    })

    expect(apiFns.apiPaginated).toHaveBeenCalledWith(getHistory, [
      HISTORY.TYPES.APPROVED,
      { limit: 25, offset: 50, sort: 'creatorName,asc' },
    ])
    expect(updatePageState).toHaveBeenCalledWith({ data: approvedData })
  })

  it('falls back to default sort when settings have no sort for the type', async () => {
    const apiFns = {
      apiPaginated: vi.fn(async () => []),
    }
    const updatePageState = vi.fn()

    const { result } = renderHook(
      () =>
        usePageData({
          apiFns,
          conceptState: { data: [] },
          pageState: { limit: 25, offset: 0 },
        }),
      {
        wrapper: createWrapper({
          selectedType: HISTORY.TYPES.APPROVED,
          historySort: undefined,
        }),
      }
    )

    await act(async () => {
      await result.current({ updatePageState })
    })

    expect(apiFns.apiPaginated).toHaveBeenCalledWith(getHistory, [
      HISTORY.TYPES.APPROVED,
      { limit: 25, offset: 0, sort: 'creationTimestamp,desc' },
    ])
  })

  it('sorts pending data by text field and applies descending order before paging', async () => {
    const conceptState = {
      data: [
        { id: 1, field: 'beta' },
        { id: 2, field: 'alpha' },
        { id: 3, field: 'gamma' },
      ],
    }
    const pageState = { limit: 2, offset: 0 }
    const updatePageState = vi.fn()

    const { result } = renderHook(
      () =>
        usePageData({
          apiFns: { apiPaginated: vi.fn() },
          conceptState,
          pageState,
        }),
      {
        wrapper: createWrapper({
          selectedType: HISTORY.TYPES.PENDING,
          historySort: { pending: { field: 'field', order: 'desc' } },
        }),
      }
    )

    await act(async () => {
      await result.current({ updatePageState })
    })

    expect(updatePageState).toHaveBeenCalledWith({
      data: [
        { id: 3, field: 'gamma' },
        { id: 1, field: 'beta' },
      ],
    })
  })

  it('slices concept data by limit and offset for concept type', async () => {
    const conceptState = {
      data: [
        { id: 1, value: 'a' },
        { id: 2, value: 'b' },
        { id: 3, value: 'c' },
      ],
    }
    const pageState = { limit: 2, offset: 1 }
    const apiPaginated = vi.fn()
    const updatePageState = vi.fn()

    const { result } = renderHook(
      () =>
        usePageData({
          apiFns: { apiPaginated },
          conceptState,
          pageState,
        }),
      { wrapper: createWrapper({ selectedType: HISTORY.TYPES.CONCEPT }) }
    )

    await act(async () => {
      await result.current({ updatePageState })
    })

    expect(apiPaginated).not.toHaveBeenCalled()
    expect(updatePageState).toHaveBeenCalledWith({
      data: [
        { id: 2, value: 'b' },
        { id: 3, value: 'c' },
      ],
    })
  })
})
