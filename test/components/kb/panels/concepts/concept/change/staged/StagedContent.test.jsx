import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import StagedContent from '@/components/kb/panels/concepts/concept/change/staged/modal/StagedContent'
import StagedAliasHeader from '@/components/kb/panels/concepts/concept/change/staged/aliases/StagedAliasHeader'
import StagedChildHeader from '@/components/kb/panels/concepts/concept/change/staged/children/StagedChildHeader'
import StagedMediaItemHeader from '@/components/kb/panels/concepts/concept/change/staged/media/StagedMediaItemHeader'
import StagedRealizationHeader from '@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealizationHeader'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import CONFIG from '@/lib/config'

vi.mock('@/components/kb/panels/concepts/concept/change/staged/aliases/StagedAlias', () => ({
  default: ({ stagedItem }) => <div data-testid={`staged-alias-${stagedItem.updates.name}`} />,
}))
vi.mock('@/components/kb/panels/concepts/concept/change/staged/children/StagedChild', () => ({
  default: ({ parentName, stagedItem }) => <div data-testid={`staged-child-${stagedItem.updates.name}`} data-parent={parentName} />,
}))
vi.mock('@/components/kb/panels/concepts/concept/change/staged/media/StagedMediaItem', () => ({
  default: ({ stagedItem }) => <div data-testid={`staged-media-${stagedItem.updates.url}`} />,
}))
vi.mock('@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealization', () => ({
  default: ({ stagedItem }) => <div data-testid={`staged-realization-${stagedItem.updates.linkName}`} />,
}))
vi.mock('@/components/kb/panels/concepts/concept/change/staged/StagedObject', async importOriginal => {
  const { default: StagedObject } = await importOriginal()
  return {
    default: props => <div data-testid={`staged-object-${props.field}`}><StagedObject {...props} /></div>,
  }
})

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

const renderStagedContent = ({ initialState, stagedState, relatedCount = 0 }) => {
  const closeModal = vi.fn()
  const apiResult = vi.fn(async () => relatedCount)
  const configValue = { apiFns: { apiResult } }
  const panelDataValue = { getReferences: vi.fn(() => []) }

  const utils = render(
    <ConfigContext.Provider value={configValue}>
      <PanelDataContext.Provider value={panelDataValue}>
        <ConceptModalContext.Provider value={{ closeModal }}>
          <ConceptContext.Provider value={{ initialState }}>
            <ConceptStagedContext.Provider value={{ confirmReset: null, stagedState }}>
              <StagedContent />
            </ConceptStagedContext.Provider>
          </ConceptContext.Provider>
        </ConceptModalContext.Provider>
      </PanelDataContext.Provider>
    </ConfigContext.Provider>
  )

  return { ...utils, apiResult, closeModal }
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

  it('labels staged parent and author edits', () => {
    const initialState = { ...baseState, parent: { action: 'None', value: 'old-parent' } }
    const stagedState = {
      ...initialState,
      author: { action: 'Edit', value: 'new-author', stagedSeq: 2 },
      parent: { action: 'Edit', value: 'new-parent', stagedSeq: 1 },
    }

    renderStagedContent({ initialState, stagedState })

    expect(screen.getByText('Change Parent:')).toBeInTheDocument()
    expect(screen.getByText(/old-parent.*new-parent/)).toBeInTheDocument()
    expect(screen.queryByText('Parent Edit:')).not.toBeInTheDocument()
    expect(screen.getByText('Edit Author:')).toBeInTheDocument()
  })

  it('labels staged name and rank edits', () => {
    const initialState = { ...baseState, name: { action: 'None', value: 'old-name', extent: '' } }
    const stagedState = {
      ...initialState,
      name: { action: 'Edit Name', value: 'new-name', extent: '', stagedSeq: 1 },
      rank: { action: 'Edit Rank', level: '1', name: 'species', stagedSeq: 2 },
    }
    renderStagedContent({ initialState, stagedState })

    expect(screen.getByTestId('staged-object-name')).toHaveTextContent('Change Name:')
    expect(screen.getByTestId('staged-object-rank')).toHaveTextContent('Edit Rank:')
  })

  const renamedState = () => {
    const initialState = { ...baseState, name: { action: 'None', value: 'old-name', extent: '' } }
    const stagedState = {
      ...initialState,
      name: { action: 'Edit Name', value: 'new-name', extent: 'Reassign Related Data', stagedSeq: 1 },
    }
    return { initialState, stagedState }
  }

  it('omits the name extent when the concept has no related data', async () => {
    const { apiResult } = renderStagedContent(renamedState())

    await waitFor(() => expect(apiResult).toHaveBeenCalledTimes(6))
    expect(screen.queryByText(/Reassign Related Data/)).not.toBeInTheDocument()
  })

  it('shows the name extent when the concept has related data', async () => {
    renderStagedContent({ ...renamedState(), relatedCount: 1 })

    expect(await screen.findByText(/Reassign Related Data/)).toBeInTheDocument()
  })

  it('closes the modal when the concept state is unavailable', () => {
    const { closeModal } = renderStagedContent({ initialState: null, stagedState: {} })

    expect(closeModal).toHaveBeenCalledWith(true)
  })

  describe('staged item headers', () => {
    it.each([
      ['ALIAS', StagedAliasHeader, 'stagedAlias', { action: 'Add Alias', updates: { name: 'alias' } }, 'Add Alias'],
      ['CHILD', StagedChildHeader, 'stagedChild', { action: 'Add Child', updates: { name: 'child' } }, 'Add Child'],
      ['MEDIA', StagedMediaItemHeader, 'stagedMediaItem', { action: 'Add Media', updates: { url: 'image.png' } }, 'Add Media'],
      ['REALIZATION', StagedRealizationHeader, 'stagedRealization', { action: 'Add Realization', updates: { linkName: 'link' } }, 'Add Realization'],
    ])('uses the configured %s action title', (field, Header, prop, item, expected) => {
      const titles = CONFIG.PANELS.CONCEPTS.MODALS.ITEM_TITLES[field]
      const original = titles.ADD
      const { rerender } = render(<Header {...{ [prop]: item }} />)
      expect(screen.getByText(`${expected}:`)).toBeInTheDocument()
      titles.ADD = 'Configured action title'
      try {
        rerender(<Header {...{ [prop]: item }} />)
        expect(screen.getByText('Configured action title:')).toBeInTheDocument()
      } finally {
        titles.ADD = original
      }
    })
  })

  it('uses the parent name at each child addition in staged save order', () => {
    const initialState = { ...baseState, name: { action: 'None', value: 'original', extent: '' } }
    const stagedState = {
      ...initialState,
      name: { action: 'Edit Name', value: 'renamed', extent: '', stagedSeq: 2 },
      children: [
        { name: 'first', author: '', rankName: '', rankLevel: '', action: 'Add Child', index: 0, stagedSeq: 1 },
        { name: 'second', author: '', rankName: '', rankLevel: '', action: 'Add Child', index: 1, stagedSeq: 3 },
      ],
    }

    const { getByTestId } = renderStagedContent({ initialState, stagedState })
    expect(getByTestId('staged-child-first')).toHaveAttribute('data-parent', 'original')
    expect(getByTestId('staged-child-second')).toHaveAttribute('data-parent', 'renamed')
  })
})
