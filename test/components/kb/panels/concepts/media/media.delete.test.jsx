import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Concepts from '@/components/kb/panels/Concepts'

import {
  ConceptPanelTestWrapper,
  MEDIA_URLS,
  createMediaItem,
  enterEditMode,
  clickDeleteMediaButton,
  clickStageButton,
  clickDiscardButton,
  clickDiscardAllButton,
  confirmDiscard,
} from '../concept.panel.test.wrapper'

vi.mock('@/lib/model/media', async importOriginal => {
  const original = await importOriginal()
  return {
    ...original,
    checkMediaUrlExists: vi.fn(() => Promise.resolve(true)),
  }
})

describe('Media Delete - Single Media Item', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes the only image media item', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Solo Image Credit',
        isPrimary: true,
        id: 'media-1',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    expect(screen.getByText(/Solo Image Credit/)).toBeInTheDocument()

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Delete media')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })
  })

  it('deletes the only video media item', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.VIDEO.beach,
        credit: 'Solo Video Credit',
        isPrimary: true,
        id: 'media-1',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
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
  })

  it('deletes the only icon media item', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.ICON.dingosky,
        credit: 'Solo Icon Credit',
        isPrimary: true,
        id: 'media-1',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
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
  })
})

describe('Media Delete - Non-Primary Media', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes primary image when multiple images exist shows reassignment message', async () => {
    const user = userEvent.setup()

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
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(/primary is being randomly reassigned/i)).toBeInTheDocument()
    })

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Delete media')).not.toBeInTheDocument()
    })
  })

  it('deletes primary video when multiple videos exist shows reassignment message', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.VIDEO.beach,
        credit: 'Primary Video',
        isPrimary: true,
        id: 'media-1',
      }),
      createMediaItem({
        url: MEDIA_URLS.VIDEO.tree,
        credit: 'Secondary Video',
        isPrimary: false,
        id: 'media-2',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(/primary is being randomly reassigned/i)).toBeInTheDocument()
    })

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Delete media')).not.toBeInTheDocument()
    })
  })
})

describe('Media Delete - Primary Media with Reassignment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows primary reassignment message when deleting primary image with other images', async () => {
    const user = userEvent.setup()

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
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(/primary is being randomly reassigned/i)).toBeInTheDocument()
    })

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Delete media')).not.toBeInTheDocument()
    })
  })

  it('shows primary reassignment message when deleting primary video with other videos', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.VIDEO.beach,
        credit: 'Primary Video',
        isPrimary: true,
        id: 'media-1',
      }),
      createMediaItem({
        url: MEDIA_URLS.VIDEO.tree,
        credit: 'Secondary Video',
        isPrimary: false,
        id: 'media-2',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(/primary is being randomly reassigned/i)).toBeInTheDocument()
    })
  })

  it('does not show reassignment message when deleting primary with no other media of same type', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Primary Image',
        isPrimary: true,
        id: 'media-1',
      }),
      createMediaItem({
        url: MEDIA_URLS.VIDEO.beach,
        credit: 'Video',
        isPrimary: true,
        id: 'media-2',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    expect(screen.queryByText(/primary is being randomly reassigned/i)).not.toBeInTheDocument()
  })
})

describe('Media Delete - Discard Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('discard button closes delete modal without staging', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Image Credit',
        isPrimary: true,
        id: 'media-1',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    await clickDiscardButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Delete media')).not.toBeInTheDocument()
    })

    expect(screen.queryByRole('button', { name: 'Discard All' })).not.toBeInTheDocument()
  })

  it('discard all removes staged delete operation', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Image Credit',
        isPrimary: true,
        id: 'media-1',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
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
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })

    await clickDiscardAllButton(user, screen)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument()
    })

    await confirmDiscard(user, screen)

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Discard All' })).not.toBeInTheDocument()
    })
  })
})

describe('Media Delete - Mixed Media Types', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes image from mixed media collection', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Image Credit',
        isPrimary: true,
        id: 'media-1',
      }),
      createMediaItem({
        url: MEDIA_URLS.VIDEO.beach,
        credit: 'Video Credit',
        isPrimary: true,
        id: 'media-2',
      }),
      createMediaItem({
        url: MEDIA_URLS.ICON.dingosky,
        credit: 'Icon Credit',
        isPrimary: true,
        id: 'media-3',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
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
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })
  })

  it('deletes multiple media items sequentially', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Image 1',
        isPrimary: true,
        id: 'media-1',
      }),
      createMediaItem({
        url: MEDIA_URLS.IMAGE.pack,
        credit: 'Image 2',
        isPrimary: false,
        id: 'media-2',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
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
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })
  })
})

describe('Media Delete - Delete Modal Content', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays media details in delete confirmation', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Test Credit for Display',
        caption: 'Test Caption for Display',
        isPrimary: true,
        id: 'media-1',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    expect(screen.getByText(/Test Credit for Display/)).toBeInTheDocument()
  })

  it('displays URL in delete confirmation', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Credit',
        isPrimary: true,
        id: 'media-1',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    expect(screen.getByText(/head_01\.jpg/)).toBeInTheDocument()
  })

  it('displays primary status in delete confirmation for primary media', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Credit',
        isPrimary: true,
        id: 'media-1',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    expect(screen.getByText(/true/i)).toBeInTheDocument()
  })
})

describe('Media Delete - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('handles deletion of media with empty caption', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Credit Only',
        caption: '',
        isPrimary: true,
        id: 'media-1',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
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
  })

  it('handles deletion of media with long caption', async () => {
    const user = userEvent.setup()

    const longCaption =
      'This is a very long caption that describes the media item in great detail, including information about the subject, the location, the time of day, and various other relevant details that might be useful for understanding the context of the image.'

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Photographer Name',
        caption: longCaption,
        isPrimary: true,
        id: 'media-1',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
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
  })

  it('handles rapid delete operations', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Image Credit',
        isPrimary: true,
        id: 'media-1',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    await clickDiscardButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Delete media')).not.toBeInTheDocument()
    })

    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Delete media')).not.toBeInTheDocument()
    })
  })
})

describe('Media Delete - Three or More Media Items', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes from collection of three images', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Image 1',
        isPrimary: true,
        id: 'media-1',
      }),
      createMediaItem({
        url: MEDIA_URLS.IMAGE.pack,
        credit: 'Image 2',
        isPrimary: false,
        id: 'media-2',
      }),
      createMediaItem({
        url: MEDIA_URLS.IMAGE.pup,
        credit: 'Image 3',
        isPrimary: false,
        id: 'media-3',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(/primary is being randomly reassigned/i)).toBeInTheDocument()
    })

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Delete media')).not.toBeInTheDocument()
    })
  })

  it('deletes from collection of five images', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Head Image',
        isPrimary: true,
        id: 'media-1',
      }),
      createMediaItem({
        url: MEDIA_URLS.IMAGE.pack,
        credit: 'Pack Image',
        isPrimary: false,
        id: 'media-2',
      }),
      createMediaItem({
        url: MEDIA_URLS.IMAGE.pup,
        credit: 'Pup Image',
        isPrimary: false,
        id: 'media-3',
      }),
      createMediaItem({
        url: MEDIA_URLS.IMAGE.side_01,
        credit: 'Side 1 Image',
        isPrimary: false,
        id: 'media-4',
      }),
      createMediaItem({
        url: MEDIA_URLS.IMAGE.side_02,
        credit: 'Side 2 Image',
        isPrimary: false,
        id: 'media-5',
      }),
    ]

    render(
      <ConceptPanelTestWrapper initialMedia={initialMedia}>
        <Concepts />
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
  })
})
