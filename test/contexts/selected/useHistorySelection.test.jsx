import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import useHistorySelection from '@/contexts/selected/useHistorySelection'

describe('useHistorySelection', () => {
  it('tracks push/back/forward navigation and updates current item', () => {
    const onCurrentChange = vi.fn()
    const { result } = renderHook(() => useHistorySelection('Concepts', onCurrentChange))

    expect(result.current.current()).toBe('Concepts')

    act(() => {
      result.current.push('Templates')
      result.current.push('History')
    })

    expect(result.current.current()).toBe('History')
    expect(result.current.canGoBack()).toBe(true)
    expect(result.current.backItems()).toEqual(['Templates', 'Concepts'])

    act(() => {
      result.current.back()
    })

    expect(result.current.current()).toBe('Templates')
    expect(onCurrentChange).toHaveBeenLastCalledWith('Templates')

    act(() => {
      result.current.goBack(1)
    })

    expect(result.current.current()).toBe('Concepts')

    act(() => {
      result.current.goForward(2)
    })

    expect(result.current.current()).toBe('History')
    expect(result.current.canGoForward()).toBe(false)
    expect(onCurrentChange).toHaveBeenLastCalledWith('History')
  })

  it('supports clearing and re-initializing history state', () => {
    const onCurrentChange = vi.fn()
    const { result } = renderHook(() => useHistorySelection('Concepts', onCurrentChange))

    act(() => {
      result.current.clear()
    })

    expect(result.current.current()).toBe(null)
    expect(onCurrentChange).toHaveBeenLastCalledWith(null)

    act(() => {
      result.current.init({ state: ['Concepts', 'History'], position: 1 })
    })

    expect(result.current.current()).toBe('History')
    expect(result.current.getPosition()).toBe(1)
    expect(result.current.getState()).toEqual(['Concepts', 'History'])
    expect(onCurrentChange).toHaveBeenLastCalledWith('History')
  })
})
