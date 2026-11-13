import { render } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import PendingContent from '@/components/kb/panels/concepts/concept/change/pending/modal/PendingContent'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { PENDING } from '@/lib/constants/pending.js'

vi.mock('@/components/kb/panels/concepts/concept/change/pending/concept/PendingConceptItem', () => ({
  default: ({ item }) => <div data-testid={`pending-item-${item.id}`} />,
}))

const renameItem = {
  id: 'n1',
  concept: 'dingo-2',
  field: 'ConceptName',
  action: 'Edit',
  oldValue: 'dingo',
  newValue: 'dingo-2',
  creationTimestamp: '2026-11-12T16:24:00Z',
}

const aliasItem = {
  id: 'a1',
  concept: 'dingo-2',
  field: 'ConceptName',
  action: 'Add',
  newValue: 'dingo',
  creationTimestamp: '2026-11-12T16:25:00Z',
}

const mediaItem = {
  id: 'm1',
  concept: 'dingo-2',
  field: 'Media',
  action: 'Add',
  newValue: 'image.jpg',
  creationTimestamp: '2026-11-12T16:23:00Z',
}

const renderPendingContent = ({ pendingConcept, pendingParent = [] }) => {
  const setModal = vi.fn()
  const pending = vi.fn(key => {
    if (key === PENDING.DATA.CONCEPT) return pendingConcept
    if (key === PENDING.DATA.PARENT) return pendingParent
    return []
  })

  const utils = render(
    <ConceptModalContext.Provider value={{ setModal }}>
      <ConceptContext.Provider value={{ concept: { name: 'dingo-2', parent: 'root' }, pending }}>
        <PendingContent />
      </ConceptContext.Provider>
    </ConceptModalContext.Provider>
  )

  return { ...utils, setModal }
}

const itemOrder = container =>
  [...container.querySelectorAll('[data-testid^="pending-item-"]')].map(el => el.dataset.testid)

describe('PendingContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('orders pending items chronologically by creationTimestamp', () => {
    const { container } = renderPendingContent({ pendingConcept: [aliasItem, renameItem, mediaItem] })

    expect(itemOrder(container)).toEqual(['pending-item-m1', 'pending-item-n1', 'pending-item-a1'])
  })

  it('positions the pending child item by its own creationTimestamp', () => {
    const childAddItem = {
      id: 'c1',
      concept: 'root',
      field: 'Concept.child',
      action: 'Add',
      newValue: 'dingo-2',
      creationTimestamp: '2026-11-12T16:24:30Z',
    }

    const { container } = renderPendingContent({
      pendingConcept: [aliasItem, renameItem],
      pendingParent: [childAddItem],
    })

    expect(itemOrder(container)).toEqual(['pending-item-n1', 'pending-item-c1', 'pending-item-a1'])
  })

  it('closes the modal when there is nothing pending', () => {
    const { container, setModal } = renderPendingContent({ pendingConcept: [] })

    expect(setModal).toHaveBeenCalledWith(null)
    expect(itemOrder(container)).toEqual([])
  })
})
