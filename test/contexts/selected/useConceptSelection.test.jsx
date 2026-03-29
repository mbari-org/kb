import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import useConceptSelection from '@/contexts/selected/useConceptSelection'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

describe('useConceptSelection', () => {
  it('removes a concept name from history and deduplicates adjacent entries', () => {
    const onCurrentChange = vi.fn()

    const wrapper = ({ children }) => (
      <TaxonomyContext.Provider value={{ rootName: 'root' }}>{children}</TaxonomyContext.Provider>
    )

    const { result } = renderHook(() => useConceptSelection(onCurrentChange), { wrapper })

    expect(result.current.current()).toBe('root')

    act(() => {
      result.current.push('dingo')
      result.current.push('object')
      result.current.push('dingo')
      result.current.removeName('object')
    })

    expect(result.current.getState()).toEqual(['root', 'dingo'])
    expect(result.current.current()).toBe('dingo')
    expect(result.current.backItems()).toEqual(['root'])
    expect(onCurrentChange).toHaveBeenLastCalledWith('dingo')
  })
})
