import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import StagedContent from '@/components/kb/panels/concepts/concept/change/staged/modal/StagedContent'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

vi.mock('@/components/kb/panels/concepts/concept/change/staged/aliases/StagedAlias', () => ({
  default: ({ stagedItem }) => <div data-testid={`staged-alias-${stagedItem.updates.name}`} />,
}))
vi.mock('@/components/kb/panels/concepts/concept/change/staged/children/StagedChild', () => ({
  default: ({ stagedItem }) => <div data-testid={`staged-child-${stagedItem.updates.name}`} />,
}))
vi.mock('@/components/kb/panels/concepts/concept/change/staged/media/StagedMediaItem', () => ({
  default: ({ stagedItem }) => <div data-testid={`staged-media-${stagedItem.updates.url}`} />,
}))
vi.mock('@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealization', () => ({
  default: ({ stagedItem }) => <div data-testid={`staged-realization-${stagedItem.updates.linkName}`} />,
}))
vi.mock('@/components/kb/panels/concepts/concept/change/staged/StagedObject', () => ({
  default: ({ field }) => <div data-testid={`staged-object-${field}`} />,
}))
vi.mock('@/components/kb/panels/concepts/concept/change/staged/StagedValue', () => ({
  default: ({ field }) => <div data-testid={`staged-value-${field}`} />,
}))

const baseState = {
  aliasIndex: 0,
  aliases: [],
  author: { action: 'None', value: '' },
  children: [],
  deleteConcept: false,
  media: [],
  mediaIndex: 0,
  name: { action: 'None', value: '', extent: '' },
  parent: { action: 'None', value: '' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
  realizationIndex: 0,
  templates: [],
}

const renderStagedContent = ({ initialState, stagedState }) => {
  const closeModal = vi.fn()

  const utils = render(
    <ConceptModalContext.Provider value={{ closeModal }}>
      <ConceptContext.Provider value={{ initialState }}>
        <ConceptStagedContext.Provider value={{ confirmReset: null, stagedState }}>
          <StagedContent />
        </ConceptStagedContext.Provider>
      </ConceptContext.Provider>
    </ConceptModalContext.Provider>
  )

  return { ...utils, closeModal }
}

const itemOrder = container =>
  [...container.querySelectorAll('[data-testid^="staged-"]')].map(el => el.dataset.testid)

describe('StagedContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('orders staged items chronologically by stagedSeq across fields', () => {
    const stagedState = {
      ...baseState,
      aliases: [
        { name: 'later-alias', nameType: 'Common', author: '', action: 'Add Alias', index: 0, stagedSeq: 3 },
      ],
      children: [
        { name: 'first-child', author: '', rankName: '', rankLevel: '', action: 'Add Child', index: 0, stagedSeq: 1 },
      ],
      media: [
        { url: 'middle.jpg', mediaType: 'Image', action: 'Add Media', stateId: 'm1', stagedSeq: 2 },
      ],
      name: { action: 'Edit Name', value: 'new-name', extent: '', stagedSeq: 4 },
    }

    const { container } = renderStagedContent({ initialState: baseState, stagedState })

    expect(itemOrder(container)).toEqual([
      'staged-child-first-child',
      'staged-media-middle.jpg',
      'staged-alias-later-alias',
      'staged-object-name',
    ])
  })

  it('closes the modal when there are no staged edits', () => {
    const { closeModal } = renderStagedContent({ initialState: baseState, stagedState: baseState })

    expect(closeModal).toHaveBeenCalledWith(true)
  })
})
