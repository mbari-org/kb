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

const makeWrapper = (conceptPath, taxonomyFns) => {
  const Wrapper = ({ children }) => (
    <AppModalContext.Provider value={{ beginProcessing: vi.fn() }}>
      <ConceptContext.Provider value={{ conceptPath }}>
        <TaxonomyContext.Provider value={{ ...taxonomyFns, taxonomy }}>{children}</TaxonomyContext.Provider>
      </ConceptContext.Provider>
    </AppModalContext.Provider>
  )
  Wrapper.displayName = 'UseExpandConceptTestWrapper'
  return Wrapper
}

const setup = (conceptPath = null) => {
  const loadConceptChildren = vi.fn()
  const loadConceptDescendants = vi.fn()
  const setExpandedItems = vi.fn()
  const { result } = renderHook(() => useExpandConcept([], setExpandedItems), {
    wrapper: makeWrapper(conceptPath, { loadConceptChildren, loadConceptDescendants }),
  })
  return { expandConcept: result.current, loadConceptChildren, setExpandedItems }
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

describe('useExpandConcept self', () => {
  it('adds only the concept itself to expandedItems', () => {
    const { expandConcept, setExpandedItems } = setup()

    act(() => {
      expandConcept({ name: 'object' }, CONCEPT.EXPAND.SELF)
    })

    expect(applyUpdate(setExpandedItems, ['entity'])).toEqual(['entity', 'object'])
  })

  it('loads the concept children so child disclosure state is known', () => {
    const { expandConcept, loadConceptChildren } = setup()

    act(() => {
      expandConcept({ name: 'object' }, CONCEPT.EXPAND.SELF)
    })

    expect(loadConceptChildren).toHaveBeenCalledWith('object')
  })
})

describe('useExpandConcept toParent', () => {
  it('expands the concept path without the concept itself', () => {
    const { expandConcept, setExpandedItems } = setup(['root', 'object', 'physical object'])

    act(() => {
      expandConcept({ name: 'physical object' }, CONCEPT.EXPAND.TO_PARENT)
    })

    expect(applyUpdate(setExpandedItems, ['entity'])).toEqual(['entity', 'root', 'object'])
  })

  it('does nothing when there is no concept path', () => {
    const { expandConcept, setExpandedItems } = setup()

    act(() => {
      expandConcept({ name: 'physical object' }, CONCEPT.EXPAND.TO_PARENT)
    })

    expect(setExpandedItems).not.toHaveBeenCalled()
  })
})
