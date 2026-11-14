import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import PendingContent from '@/components/kb/panels/concepts/concept/change/pending/modal/PendingContent'
import PendingChildItem from '@/components/kb/panels/history/pending/PendingChildItem'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import UserContext from '@/contexts/user/UserContext'
import { ACTION, HISTORY_FIELD, PENDING } from '@/lib/constants'

const childAdd = {
  id: 'child-add',
  concept: 'parent-concept',
  field: HISTORY_FIELD.CHILD,
  action: ACTION.ADD,
  newValue: 'child-concept',
  creationTimestamp: '2026-11-12T16:24:30Z',
}

describe('pending child additions', () => {
  it.each([
    ['parent', { name: 'parent-concept', parent: 'root' }, [childAdd], []],
    ['child', { name: 'child-concept', parent: 'parent-concept' }, [], [childAdd]],
  ])('shows the parent in the Concept panel when viewing the %s', (_view, concept, pendingConcept, pendingParent) => {
    const pending = key => {
      if (key === PENDING.DATA.CONCEPT) return pendingConcept
      if (key === PENDING.DATA.PARENT) return pendingParent
      return null
    }
    render(
      <UserContext.Provider value={{ isAdmin: false }}>
        <ConceptModalContext.Provider value={{ setModal: vi.fn() }}>
          <ConceptContext.Provider value={{ concept, pending }}>
            <PendingContent />
          </ConceptContext.Provider>
        </ConceptModalContext.Provider>
      </UserContext.Provider>
    )

    expect(screen.getByText('Parent:').parentElement).toHaveTextContent('parent-concept')
  })

  it('shows the parent in History pending details', () => {
    render(<PendingChildItem item={childAdd} />)

    expect(screen.getByText('Parent:').parentElement).toHaveTextContent('parent-concept')
  })

  it('does not add a parent row to History child deletions', () => {
    render(<PendingChildItem item={{ ...childAdd, action: ACTION.DELETE, oldValue: 'child-concept' }} />)

    expect(screen.queryByText('Parent:')).not.toBeInTheDocument()
  })
})
