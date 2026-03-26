import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import usePageData from '@/contexts/panels/history/usePageData'
import SelectedContext from '@/contexts/selected/SelectedContext'
import { getHistory } from '@/lib/api/history'
import { SELECTED } from '@/lib/constants/selected'

const createWrapper = ({ selectedType }) => {
  const getSettings = (key, subKey) => {
    if (key === SELECTED.SETTINGS.HISTORY.KEY && subKey === SELECTED.SETTINGS.HISTORY.TYPE) {
      return selectedType
    }
    return undefined
  }

  const Wrapper = ({ children }) => (
    <SelectedContext.Provider value={{ getSettings }}>
      {children}
    </SelectedContext.Provider>
  )
  Wrapper.displayName = 'UsePageDataTestWrapper'
  return Wrapper
}

describe('usePageData', () => {
  it('uses paginated API history fetch for approved type', async () => {
    const approvedData = [{ id: 1 }, { id: 2 }]
    const apiFns = {
      apiPaginated: vi.fn(async () => approvedData),
    }
    const updatePageState = vi.fn()
    const conceptState = { data: [] }
    const pageState = { limit: 25, offset: 50, sortField: 'creationTimestamp', sortOrder: 'desc' }

    const { result } = renderHook(
      () =>
        usePageData({
          apiFns,
          conceptState,
          pageState,
        }),
      { wrapper: createWrapper({ selectedType: SELECTED.SETTINGS.HISTORY.TYPES.APPROVED }) }
    )

    await act(async () => {
      await result.current({ updatePageState })
    })

    expect(apiFns.apiPaginated).toHaveBeenCalledWith(getHistory, [
      SELECTED.SETTINGS.HISTORY.TYPES.APPROVED,
      { limit: 25, offset: 50, sort: 'creationTimestamp,desc' },
    ])
    expect(updatePageState).toHaveBeenCalledWith({ data: approvedData })
  })

  it('sorts pending data by text field and applies descending order before paging', async () => {
    const conceptState = {
      data: [
        { id: 1, field: 'beta' },
        { id: 2, field: 'alpha' },
        { id: 3, field: 'gamma' },
      ],
    }
    const pageState = { limit: 2, offset: 0, sortField: 'field', sortOrder: 'desc' }
    const updatePageState = vi.fn()

    const { result } = renderHook(
      () =>
        usePageData({
          apiFns: { apiPaginated: vi.fn() },
          conceptState,
          pageState,
        }),
      { wrapper: createWrapper({ selectedType: SELECTED.SETTINGS.HISTORY.TYPES.PENDING }) }
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
    const pageState = { limit: 2, offset: 1, sortField: 'creationTimestamp', sortOrder: 'asc' }
    const apiPaginated = vi.fn()
    const updatePageState = vi.fn()

    const { result } = renderHook(
      () =>
        usePageData({
          apiFns: { apiPaginated },
          conceptState,
          pageState,
        }),
      { wrapper: createWrapper({ selectedType: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT }) }
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
