import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { describe, expect, it, vi } from 'vitest'

import PendingContent from '@/components/kb/panels/concepts/concept/change/pending/modal/PendingContent'
import PendingChildItem from '@/components/kb/panels/history/pending/PendingChildItem'
import PendingParentItem from '@/components/kb/panels/history/pending/PendingParentItem'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import ConceptModalProcessingContext from '@/contexts/panels/concepts/modal/ConceptModalProcessingContext'
import UserContext from '@/contexts/user/UserContext'
import { ACTION, HISTORY_FIELD, PENDING } from '@/lib/constants'
import kbTheme from '@/lib/theme'

vi.mock('@/components/kb/panels/concepts/concept/change/pending/usePendingNameData', () => ({
  default: () => null,
}))

const childAdd = {
  id: 'child-add',
  concept: 'parent-concept',
  field: HISTORY_FIELD.CHILD,
  action: ACTION.ADD,
  newValue: 'child-concept',
  creationTimestamp: '2026-11-12T16:24:30Z',
}

const parentEdit = {
  id: 'parent-edit',
  concept: 'child-concept',
  field: HISTORY_FIELD.PARENT,
  action: ACTION.EDIT,
  oldValue: 'old-parent',
  newValue: 'new-parent',
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
        <ConceptModalProcessingContext.Provider value={{ processing: false }}>
          <ConceptModalContext.Provider value={{ setModal: vi.fn() }}>
            <ConceptContext.Provider value={{ concept, pending }}>
              <PendingContent />
            </ConceptContext.Provider>
          </ConceptModalContext.Provider>
        </ConceptModalProcessingContext.Provider>
      </UserContext.Provider>
    )

    expect(screen.getByText('Parent:').parentElement).toHaveTextContent('parent-concept')
  })

  describe('pending parent changes', () => {
    it('labels a parent edit in the Concept pending modal', () => {
      const pending = key => {
        if (key === PENDING.DATA.CONCEPT) return [parentEdit]
        if (key === PENDING.DATA.PARENT) return []
        return null
      }

      render(
        <UserContext.Provider value={{ isAdmin: false }}>
          <ConceptModalProcessingContext.Provider value={{ processing: false }}>
            <ConceptModalContext.Provider value={{ setModal: vi.fn() }}>
              <ConceptContext.Provider value={{ concept: { name: 'child-concept', parent: 'new-parent' }, pending }}>
                <PendingContent />
              </ConceptContext.Provider>
            </ConceptModalContext.Provider>
          </ConceptModalProcessingContext.Provider>
        </UserContext.Provider>
      )

      expect(screen.getByText('Change Parent:')).toBeInTheDocument()
      expect(screen.getByText(/old-parent.*new-parent/)).toBeInTheDocument()
    })

    it('labels a parent edit in History pending details', () => {
      render(<PendingParentItem item={parentEdit} />)

      expect(screen.getByText('Change Parent:')).toBeInTheDocument()
      expect(screen.getByText(/old-parent.*new-parent/)).toBeInTheDocument()
    })
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

describe('pending detail alignment', () => {
  it.each([
    ['child addition', childAdd],
    ['name change', {
      id: 'rename',
      concept: 'new-name',
      field: HISTORY_FIELD.NAME,
      action: ACTION.EDIT,
      oldValue: 'old-name',
      newValue: 'new-name',
      creationTimestamp: '2026-11-12T16:24:30Z',
    }],
  ])('keeps %s details aligned with the title when approval buttons are hidden', (_description, item) => {
    const pending = key => {
      if (key === PENDING.DATA.CONCEPT) return [item]
      if (key === PENDING.DATA.PARENT) return []
      return null
    }
    const content = isAdmin => (
      <ThemeProvider theme={kbTheme}>
        <UserContext.Provider value={{ isAdmin }}>
          <ConceptModalProcessingContext.Provider value={{ processing: false }}>
            <ConceptModalContext.Provider value={{ setModal: vi.fn(), setModalData: vi.fn() }}>
              <ConceptModalDataContext.Provider value={{ modalData: {} }}>
                <ConceptContext.Provider value={{ concept: { name: item.concept, parent: 'root' }, pending }}>
                  <PendingContent />
                </ConceptContext.Provider>
              </ConceptModalDataContext.Provider>
            </ConceptModalContext.Provider>
          </ConceptModalProcessingContext.Provider>
        </UserContext.Provider>
      </ThemeProvider>
    )
    const { rerender } = render(content(true))
    const title = screen.getByText(item.field === HISTORY_FIELD.CHILD ? 'Add Child:' : 'Change Name:')
    const values = screen.getByText('Creator:').parentElement.parentElement
    expect(screen.getAllByRole('button')).toHaveLength(2)
    expect(values.parentElement).toBe(title.parentElement.parentElement)
    expect(values).toHaveStyle({ marginLeft: '16.8px' })

    rerender(content(false))
    expect(screen.queryAllByRole('button')).toHaveLength(0)
    expect(screen.getByText('Creator:').parentElement.parentElement.parentElement).toBe(
      screen.getByText(item.field === HISTORY_FIELD.CHILD ? 'Add Child:' : 'Change Name:').parentElement.parentElement
    )
  })
})
