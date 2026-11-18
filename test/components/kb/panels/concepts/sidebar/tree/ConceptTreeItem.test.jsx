import { act, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ConceptTreeItem from '@/components/kb/panels/concepts/sidebar/tree/ConceptTreeItem'
import { setGroupTransitionAnimatingId } from '@/components/kb/panels/concepts/sidebar/tree/lib/groupTransitionAnimationStore'

const renderedTransitions = vi.hoisted(() => [])

vi.mock('@mui/material/Collapse', () => ({
  default: function AnimatedCollapse() {
    return null
  },
}))

vi.mock('@mui/x-tree-view', () => ({
  TreeItem: ({ slots }) => {
    renderedTransitions.push(slots.groupTransition)
    return null
  },
  TreeItemProvider: ({ children }) => children,
}))

vi.mock('@/components/kb/panels/concepts/sidebar/tree/ConceptTreeLabel', () => ({
  default: function ConceptTreeLabel() {
    return null
  },
}))

afterEach(() => {
  act(() => {
    setGroupTransitionAnimatingId(null)
  })
  renderedTransitions.length = 0
})

describe('ConceptTreeItem group transition', () => {
  it('uses the animated transition only for the targeted item', () => {
    render(
      <>
        <ConceptTreeItem itemId='object' />
        <ConceptTreeItem itemId='entity' />
      </>
    )

    expect(renderedTransitions.map(component => component.name)).toEqual([
      'InstantGroupTransition',
      'InstantGroupTransition',
    ])
    renderedTransitions.length = 0
    act(() => {
      setGroupTransitionAnimatingId('object')
    })

    expect(renderedTransitions.map(component => component.name)).toEqual(['AnimatedCollapse'])
  })
})
