import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import useConceptClick from '@/components/kb/panels/concepts/sidebar/tree/lib/useConceptClick'

import { CONCEPT } from '@/lib/constants'

const setup = ({ conceptName = 'dingo' } = {}) => {
  const concept = { name: 'dingo' }
  const expandConcept = vi.fn()
  const selectConcept = vi.fn()
  const setAutoExpand = vi.fn()

  const { result } = renderHook(() => useConceptClick(concept, expandConcept, selectConcept, setAutoExpand))

  return { concept, expandConcept, selectConcept, setAutoExpand, handleClick: result.current, conceptName }
}

describe('useConceptClick', () => {
  it('toggles expansion when clicking the current concept', () => {
    const { concept, expandConcept, handleClick } = setup()

    handleClick({ altKey: false }, 'dingo')

    expect(expandConcept).toHaveBeenCalledWith(concept, CONCEPT.EXPAND.TOGGLE)
  })

  it('expands all descendants when alt-clicking the current concept', () => {
    const { concept, expandConcept, handleClick } = setup()

    handleClick({ altKey: true }, 'dingo')

    expect(expandConcept).toHaveBeenCalledWith(concept, CONCEPT.EXPAND.DESCENDANTS)
  })

  it('selects without expanding when clicking a different concept', () => {
    const { expandConcept, selectConcept, handleClick } = setup()

    handleClick({ altKey: true }, 'object')

    expect(selectConcept).toHaveBeenCalledWith('object')
    expect(expandConcept).not.toHaveBeenCalled()
  })
})
