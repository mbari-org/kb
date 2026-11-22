import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import useDisplayPending from '@/components/kb/panels/concepts/concept/change/pending/modal/useDisplayPending'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

describe('useDisplayPending', () => {
  it('clears modal data left by a blocked reject before opening the pending modal', () => {
    const setModalData = vi.fn()
    const setModal = vi.fn()

    const Wrapper = ({ children }) => (
      <ConceptContext.Provider value={{ setPendingConfirm: vi.fn() }}>
        <ConceptModalContext.Provider value={{ setModal, setModalData }}>{children}</ConceptModalContext.Provider>
      </ConceptContext.Provider>
    )

    const { result } = renderHook(() => useDisplayPending(), { wrapper: Wrapper })
    result.current('approve')

    expect(setModalData).toHaveBeenCalledWith({})
    expect(setModal).toHaveBeenCalledTimes(1)
  })
})
