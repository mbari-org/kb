import { useContext, useEffect } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Concepts from '@/components/kb/panels/Concepts'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'
import { MEDIA } from '@/lib/constants'
import { getMediaType } from '@/lib/model/media'

import {
  ConceptPanelTestWrapper,
  MEDIA_URLS,
  createMediaItem,
  enterEditMode,
  clickAddMediaButton,
  clickDeleteMediaButton,
  fillMediaForm,
  togglePrimaryCheckbox,
  clickStageButton,
  clickDiscardAllButton,
  confirmDiscard,
} from '../ConceptPanelTestWrapper'

vi.mock('@/lib/model/media', async importOriginal => {
  const original = await importOriginal()
  return {
    ...original,
    checkMediaUrlExists: vi.fn(() => Promise.resolve(true)),
  }
})

const cloneMedia = media => media.map(item => ({ ...item }))

const mediaType = item => ((item?.mediaType || getMediaType(item?.url) || '') + '').toUpperCase()
const waitForStageEnabled = async () => {
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Stage' })).toBeEnabled()
  })
}

const ConceptStateProbe = ({ onChange }) => {
  const { initialState, stagedState } = useContext(ConceptContext)

  useEffect(() => {
    onChange({
      initialMedia: cloneMedia(initialState?.media || []),
      stagedMedia: cloneMedia(stagedState?.media || []),
    })
  }, [initialState, onChange, stagedState])

  return null
}

describe('Media state integrity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('staging an add operation records an ADD action and keeps image primary invariant', async () => {
    const user = userEvent.setup()
    let latestState = { initialMedia: [], stagedMedia: [] }

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
        <ConceptStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickAddMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.head_01,
      credit: 'Primary Image Credit',
    })
    await waitForStageEnabled()

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      const stagedAdded = latestState.stagedMedia.find(item => item.url === MEDIA_URLS.IMAGE.head_01)
      expect(stagedAdded).toBeDefined()
      expect(stagedAdded.action).toBe(CONCEPT_STATE.MEDIA_ITEM.ADD)
      expect(stagedAdded.isPrimary).toBe(true)
    })

    const liveImages = latestState.stagedMedia.filter(
      item => mediaType(item) === MEDIA.TYPE.IMAGE && item.action !== CONCEPT_STATE.MEDIA_ITEM.DELETE
    )
    expect(liveImages.filter(item => item.isPrimary)).toHaveLength(1)
  })

  it('deleting primary image promotes secondary image and marks promotion as EDIT', async () => {
    const user = userEvent.setup()
    let latestState = { initialMedia: [], stagedMedia: [] }

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Primary Image',
        isPrimary: true,
        id: 'media-1',
      }),
      createMediaItem({
        url: MEDIA_URLS.IMAGE.pack,
        credit: 'Secondary Image',
        isPrimary: false,
        id: 'media-2',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
        <ConceptStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Delete media')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      const deletedPrimary = latestState.stagedMedia.find(item => item.url === MEDIA_URLS.IMAGE.head_01)
      const promotedSecondary = latestState.stagedMedia.find(item => item.url === MEDIA_URLS.IMAGE.pack)

      expect(deletedPrimary).toBeDefined()
      expect(deletedPrimary.action).toBe(CONCEPT_STATE.MEDIA_ITEM.DELETE)
      expect(deletedPrimary.isPrimary).toBe(false)

      expect(promotedSecondary).toBeDefined()
      expect(promotedSecondary.isPrimary).toBe(true)
      expect(promotedSecondary.action).toBe(CONCEPT_STATE.MEDIA_ITEM.EDIT)
      const activeImages = latestState.stagedMedia.filter(
        item => mediaType(item) === MEDIA.TYPE.IMAGE && item.action !== CONCEPT_STATE.MEDIA_ITEM.DELETE
      )
      expect(activeImages.filter(item => item.isPrimary)).toHaveLength(1)
    })
  })

  it('adding a second image as primary demotes old primary while preserving one-primary-per-type', async () => {
    const user = userEvent.setup()
    let latestState = { initialMedia: [], stagedMedia: [] }

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'First Primary',
        isPrimary: true,
        id: 'media-1',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
        <ConceptStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickAddMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.pack,
      credit: 'Second Image',
    })
    await togglePrimaryCheckbox(user, screen)
    await waitForStageEnabled()
    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      const second = latestState.stagedMedia.find(item => item.url === MEDIA_URLS.IMAGE.pack)
      const first = latestState.stagedMedia.find(item => item.url === MEDIA_URLS.IMAGE.head_01)

      expect(second).toBeDefined()
      expect(second.action).toBe(CONCEPT_STATE.MEDIA_ITEM.ADD)
      expect(second.isPrimary).toBe(true)

      expect(first).toBeDefined()
      expect(first.isPrimary).toBe(false)
    })

    const activeImages = latestState.stagedMedia.filter(
      item => mediaType(item) === MEDIA.TYPE.IMAGE && item.action !== CONCEPT_STATE.MEDIA_ITEM.DELETE
    )
    expect(activeImages.filter(item => item.isPrimary)).toHaveLength(1)
  })

  it('discard all restores staged media back to initial state actions and membership', async () => {
    const user = userEvent.setup()
    let latestState = { initialMedia: [], stagedMedia: [] }

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Existing Media',
        isPrimary: true,
        id: 'media-1',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
        <ConceptStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickAddMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.pack,
      credit: 'Staged Add',
    })
    await waitForStageEnabled()
    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })

    await clickDiscardAllButton(user, screen)
    await confirmDiscard(user, screen)

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Discard All' })).not.toBeInTheDocument()
    })

    await waitFor(() => {
      const stagedUrls = latestState.stagedMedia.map(item => item.url).sort()
      const initialUrls = latestState.initialMedia.map(item => item.url).sort()
      expect(stagedUrls).toEqual(initialUrls)
      expect(latestState.stagedMedia.every(item => item.action === CONCEPT_STATE.NO_ACTION)).toBe(true)
    })
  })
})
