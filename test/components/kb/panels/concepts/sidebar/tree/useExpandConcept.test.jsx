import { describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'

import useExpandConcept from '@/components/kb/panels/concepts/sidebar/tree/lib/useExpandConcept'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT } from '@/lib/constants'

const taxonomy = {
  rootName: 'root',
  conceptMap: {
    root: { name: 'root', children: ['object'] },
    object: { name: 'object', parent: 'root', children: ['physical object', 'entity'] },
    'physical object': { name: 'physical object', parent: 'object', children: ['data file'] },
    entity: { name: 'entity', parent: 'object', children: [] },
    'data file': { name: 'data file', parent: 'physical object', children: [] },
  },
}

const wrapper = ({ children }) => (
  <AppModalContext.Provider value={{ beginProcessing: vi.fn() }}>
    <ConceptContext.Provider value={{ conceptPath: null }}>
      <TaxonomyContext.Provider value={{ loadConceptDescendants: vi.fn(), taxonomy }}>
        {children}
      </TaxonomyContext.Provider>
    </ConceptContext.Provider>
  </AppModalContext.Provider>
)

const setup = () => {
  const setExpandedItems = vi.fn()
  const { result } = renderHook(() => useExpandConcept([], setExpandedItems), { wrapper })
  return { expandConcept: result.current, setExpandedItems }
}

const applyUpdate = (setExpandedItems, items) => setExpandedItems.mock.calls[0][0](items)

describe('useExpandConcept collapse', () => {
  it('removes the concept and all its descendants from expandedItems', () => {
    const { expandConcept, setExpandedItems } = setup()

    act(() => {
      expandConcept({ name: 'object' }, CONCEPT.EXPAND.OFF)
    })

    const expanded = ['root', 'object', 'physical object', 'entity', 'data file']
    expect(applyUpdate(setExpandedItems, expanded)).toEqual(['root'])
  })

  it('leaves unrelated expanded items in place', () => {
    const { expandConcept, setExpandedItems } = setup()

    act(() => {
      expandConcept({ name: 'physical object' }, CONCEPT.EXPAND.OFF)
    })

    const expanded = ['root', 'object', 'physical object', 'entity', 'data file']
    expect(applyUpdate(setExpandedItems, expanded)).toEqual(['root', 'object', 'entity'])
  })
})
