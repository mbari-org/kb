import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import panelMods from '@/components/kb/panels/modules'
import usePanelSelection from '@/contexts/selected/usePanelSelection'

describe('usePanelSelection', () => {
  it('starts at the first panel and tracks back/forward updates', () => {
    const onCurrentChange = vi.fn()
    const { result } = renderHook(() => usePanelSelection(onCurrentChange))

    const defaultPanel = panelMods[0].name
    expect(result.current.current()).toBe(defaultPanel)

    act(() => {
      result.current.push('Templates')
      result.current.push('History')
      result.current.back()
    })

    expect(result.current.current()).toBe('Templates')
    expect(result.current.canGoBack()).toBe(true)
    expect(result.current.canGoForward()).toBe(true)

    act(() => {
      result.current.forward()
    })

    expect(result.current.current()).toBe('History')
    expect(onCurrentChange).toHaveBeenLastCalledWith('History')
  })
})
