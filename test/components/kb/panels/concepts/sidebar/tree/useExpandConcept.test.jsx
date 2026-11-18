import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'

import useExpandConcept from '@/components/kb/panels/concepts/sidebar/tree/lib/useExpandConcept'
import {
  isGroupTransitionAnimating,
  setGroupTransitionAnimatingId,
} from '@/components/kb/panels/concepts/sidebar/tree/lib/groupTransitionAnimationStore'

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
  const loadConceptDescendants = vi.fn(async () => taxonomy)
  const cancelDescendantMedia = vi.fn()
  const setExpandedItems = vi.fn()
  const { result } = renderHook(() => useExpandConcept([], setExpandedItems), {
    wrapper: makeWrapper(conceptPath, { cancelDescendantMedia, loadConceptChildren, loadConceptDescendants }),
  })
  return { expandConcept: result.current, loadConceptChildren, setExpandedItems }
}

vi.stubGlobal('requestAnimationFrame', cb => cb())

const applyUpdate = (setExpandedItems, items) =>
  setExpandedItems.mock.calls.reduce((updated, [updater]) => updater(updated), items)

afterEach(() => {
  setGroupTransitionAnimatingId(null)
  vi.useRealTimers()
})

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

  it('animates only the node being expanded and clears the transition marker', async () => {
    vi.useFakeTimers()
    const { expandConcept } = setup()

    act(() => {
      expandConcept({ name: 'object' }, CONCEPT.EXPAND.SELF)
    })

    expect(isGroupTransitionAnimating('object')).toBe(true)
    expect(isGroupTransitionAnimating('physical object')).toBe(false)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })

    expect(isGroupTransitionAnimating('object')).toBe(false)
  })
})

describe('useExpandConcept expansion', () => {
  it('animates ordinary expansion', () => {
    const { expandConcept, setExpandedItems } = setup(['root', 'object'])

    act(() => {
      expandConcept({ name: 'object' }, CONCEPT.EXPAND.ON)
    })

    expect(isGroupTransitionAnimating('object')).toBe(true)
    expect(applyUpdate(setExpandedItems, [])).toEqual(['root', 'object'])
  })

  it('does not animate expand all', () => {
    const { expandConcept } = setup()

    act(() => {
      expandConcept({ name: 'object' }, CONCEPT.EXPAND.DESCENDANTS)
    })

    expect(isGroupTransitionAnimating('object')).toBe(false)
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
