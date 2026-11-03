import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import useConceptClick from '@/components/kb/panels/concepts/sidebar/tree/lib/useConceptClick'

import { CONCEPT } from '@/lib/constants'

const labelEvent = (extra = {}) => ({ altKey: false, target: document.createElement('div'), ...extra })

const disclosureEvent = () => {
  const container = document.createElement('div')
  container.className = 'MuiTreeItem-iconContainer'
  const icon = document.createElement('svg')
  container.appendChild(icon)
  return { altKey: false, target: icon }
}

const setup = ({ conceptName = 'dingo', expandedItems = [] } = {}) => {
  const concept = { name: 'dingo' }
  const expandConcept = vi.fn()
  const selectConcept = vi.fn()
  const setAutoExpand = vi.fn()

  const { result } = renderHook(() => useConceptClick(concept, expandConcept, selectConcept, setAutoExpand, expandedItems))

  return { concept, expandConcept, selectConcept, setAutoExpand, handleClick: result.current, conceptName }
}

describe('useConceptClick', () => {
  it('toggles expansion when clicking the current concept', () => {
    const { concept, expandConcept, handleClick } = setup()

    handleClick(labelEvent(), 'dingo')

    expect(expandConcept).toHaveBeenCalledWith(concept, CONCEPT.EXPAND.TOGGLE)
  })

  it('expands all descendants when alt-clicking the current concept', () => {
    const { concept, expandConcept, handleClick } = setup()

    handleClick(labelEvent({ altKey: true }), 'dingo')

    expect(expandConcept).toHaveBeenCalledWith(concept, CONCEPT.EXPAND.DESCENDANTS)
  })

  it('selects without expanding when clicking a different concept', () => {
    const { expandConcept, selectConcept, handleClick } = setup()

    handleClick(labelEvent({ altKey: true }), 'object')

    expect(selectConcept).toHaveBeenCalledWith('object')
    expect(expandConcept).not.toHaveBeenCalled()
  })

  it('collapses an expanded concept without selecting when clicking its disclosure icon', () => {
    const { expandConcept, selectConcept, handleClick } = setup({ expandedItems: ['object'] })

    handleClick(disclosureEvent(), 'object')

    expect(expandConcept).toHaveBeenCalledWith({ name: 'object' }, CONCEPT.EXPAND.OFF)
    expect(selectConcept).not.toHaveBeenCalled()
  })

  it('treats a disclosure icon click on a collapsed concept like a label click', () => {
    const { expandConcept, selectConcept, handleClick } = setup({ expandedItems: [] })

    handleClick(disclosureEvent(), 'object')

    expect(selectConcept).toHaveBeenCalledWith('object')
    expect(expandConcept).not.toHaveBeenCalled()
  })
})
