import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import usePageHistory from '@/contexts/panels/history/usePageHistory'
import { PAGINATION } from '@/lib/constants/pagination'

describe('usePageHistory', () => {
  it('moves forward and backward through pages with clamped offsets', () => {
    const updatePageState = vi.fn()

    const { result, rerender } = renderHook(
      ({ count, limit, offset }) =>
        usePageHistory({
          count,
          limit,
          offset,
          updatePageState,
        }),
      {
        initialProps: { count: 120, limit: 50, offset: 0 },
      }
    )

    act(() => {
      result.current.nextPage()
    })
    expect(updatePageState).toHaveBeenCalledWith({ offset: 50 })

    rerender({ count: 120, limit: 50, offset: 10 })
    act(() => {
      result.current.prevPage()
    })
    expect(updatePageState).toHaveBeenCalledWith({ offset: 0 })
  })

  it('changes page size and resets to first page', () => {
    const updatePageState = vi.fn()

    const { result } = renderHook(() =>
      usePageHistory({
        count: 300,
        limit: 50,
        offset: 100,
        updatePageState,
      })
    )

    act(() => {
      result.current.setPageSize(25)
    })

    expect(updatePageState).toHaveBeenCalledWith({ limit: 25, offset: 0 })
  })

  it('resets pagination to default history settings', () => {
    const updatePageState = vi.fn()

    const { result } = renderHook(() =>
      usePageHistory({
        count: 300,
        limit: 25,
        offset: 75,
        updatePageState,
      })
    )

    act(() => {
      result.current.resetPagination()
    })

    expect(updatePageState).toHaveBeenCalledWith({
      limit: PAGINATION.HISTORY.DEFAULT_LIMIT,
      offset: 0,
    })
  })

  it('goToPage clamps below and above valid range', () => {
    const updatePageState = vi.fn()

    const { result } = renderHook(() =>
      usePageHistory({
        count: 100,
        limit: 25,
        offset: 0,
        updatePageState,
      })
    )

    act(() => {
      result.current.goToPage(0)
    })
    expect(updatePageState).toHaveBeenCalledWith({ offset: 0 })

    act(() => {
      result.current.goToPage(10)
    })
    expect(updatePageState).toHaveBeenCalledWith({ offset: 75 })
  })
})
