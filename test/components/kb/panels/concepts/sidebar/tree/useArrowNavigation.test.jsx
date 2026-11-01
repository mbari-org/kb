import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import useArrowNavigation from '@/components/kb/panels/concepts/sidebar/tree/lib/useArrowNavigation'

import { CONCEPT } from '@/lib/constants'

const setup = () => {
  const concept = { name: 'dingo', children: ['pup'], parent: 'canis' }
  const expandConcept = vi.fn()
  const getConcept = vi.fn()
  const isExpanded = vi.fn(() => false)
  const selectConcept = vi.fn()
  const setAutoExpand = vi.fn()

  const { result } = renderHook(() =>
    useArrowNavigation(concept, expandConcept, getConcept, isExpanded, selectConcept, setAutoExpand)
  )

  return { concept, expandConcept, handleArrowKeys: result.current, selectConcept, setAutoExpand }
}

describe('useArrowNavigation', () => {
  it('expands the current concept one level on ArrowRight', () => {
    const { concept, expandConcept, handleArrowKeys } = setup()

    handleArrowKeys({ key: 'ArrowRight', altKey: false })

    expect(expandConcept).toHaveBeenCalledWith(concept, CONCEPT.EXPAND.ON)
  })

  it('expands all descendants on Opt-ArrowRight', () => {
    const { concept, expandConcept, handleArrowKeys } = setup()

    handleArrowKeys({ key: 'ArrowRight', altKey: true })

    expect(expandConcept).toHaveBeenCalledWith(concept, CONCEPT.EXPAND.DESCENDANTS)
  })
})
