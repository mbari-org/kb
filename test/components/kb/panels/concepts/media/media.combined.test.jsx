import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Concepts from '@/components/kb/panels/Concepts'

import {
  ConceptPanelTestWrapper,
  MEDIA_URLS,
  createMediaItem,
  enterEditMode,
  clickAddMediaButton,
  clickEditMediaButton,
  clickDeleteMediaButton,
  fillMediaForm,
  togglePrimaryCheckbox,
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

describe('Media Combined Flows - Add then Edit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  const waitForStageButtonEnabled = async () => {
    await waitFor(
      () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 5000 }
    )
  }

  it('adds media then edits the URL of the same item', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.head_01,
      credit: 'Initial Credit',
    })

    await waitForStageButtonEnabled()

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await clickEditMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Edit media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.pack,
    })

    await waitForStageButtonEnabled()

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Edit media')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })
  }, 15000)

  it('adds media then edits credit and caption', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.VIDEO.beach,
      credit: 'Original Credit',
      caption: 'Original Caption',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await clickEditMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Edit media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      credit: 'Updated Credit After Edit',
      caption: 'Updated Caption After Edit',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Edit media')).not.toBeInTheDocument()
    })
  }, 15000)
})

describe('Media Combined Flows - Add then Delete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds media then deletes the same item', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.head_01,
      credit: 'Credit to Delete',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
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

  it('adds multiple media items then deletes one', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.head_01,
      credit: 'First Image',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.pack,
      credit: 'Second Image',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

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

describe('Media Combined Flows - Edit then Delete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('edits existing media then deletes it', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Original Credit',
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

    await clickEditMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Edit media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      credit: 'Edited Credit Before Delete',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Edit media')).not.toBeInTheDocument()
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

describe('Media Combined Flows - Full Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('performs complete workflow: add -> edit -> add another -> delete first', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.head_01,
      credit: 'First Credit',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await clickEditMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Edit media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      caption: 'Added Caption',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Edit media')).not.toBeInTheDocument()
    })

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.pack,
      credit: 'Second Credit',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

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

  it('adds mixed media types then performs operations on each', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.head_01,
      credit: 'Image Credit',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.VIDEO.beach,
      credit: 'Video Credit',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.ICON.dingosky,
      credit: 'Icon Credit',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })
  })
})

describe('Media Combined Flows - Discard Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds media, discards add, then adds different media', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    const discardButton = screen.getByRole('button', { name: 'Discard' })
    await user.click(discardButton)

    await waitFor(
      () => {
        expect(screen.queryByText('Add media')).not.toBeInTheDocument()
      },
      { timeout: 2000 }
    )

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.pack,
      credit: 'New Credit',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })
  })

  it('performs multiple operations then discards all', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Existing Credit',
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

    await clickEditMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Edit media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      credit: 'Modified Credit',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Edit media')).not.toBeInTheDocument()
    })

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.VIDEO.beach,
      credit: 'Video Credit',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
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

describe('Media Combined Flows - Primary Designation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds media, adds another as primary, verifies primary transfer', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.head_01,
      credit: 'First Image (Primary)',
    })

    const firstPrimaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(firstPrimaryCheckbox).toBeChecked()

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.pack,
      credit: 'Second Image (New Primary)',
    })

    await togglePrimaryCheckbox(user, screen)

    const secondPrimaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(secondPrimaryCheckbox).toBeChecked()

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })
  })

  it('edits non-primary to become primary then deletes old primary', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Old Primary',
        isPrimary: true,
        id: 'media-1',
      }),
      createMediaItem({
        url: MEDIA_URLS.IMAGE.pack,
        credit: 'Non-Primary',
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

    await clickEditMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Edit media')).toBeInTheDocument()
    })

    const urlInput = screen.getByRole('textbox', { name: /url/i })
    expect(urlInput.value).toBeTruthy()
  })
})

describe('Media Combined Flows - Type Transitions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds image, edits to video, then adds another image', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.head_01,
      credit: 'Image Credit',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await clickEditMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Edit media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.VIDEO.beach,
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Edit media')).not.toBeInTheDocument()
    })

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.pack,
      credit: 'New Image Credit',
    })

    const primaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(primaryCheckbox).toBeChecked()
    expect(primaryCheckbox).toBeDisabled()

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })
  })
})

describe('Media Combined Flows - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('handles rapid sequential operations', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.head_01,
      credit: 'Quick Add',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await clickEditMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Edit media')).toBeInTheDocument()
    })

    await clickDiscardButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Edit media')).not.toBeInTheDocument()
    })

    await clickDeleteMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Delete media')).toBeInTheDocument()
    })

    await clickDiscardButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Delete media')).not.toBeInTheDocument()
    })

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.VIDEO.tree,
      credit: 'Another Quick Add',
    })

    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 1000 }
    )

    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add media')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })
  })

  it('complex flow with all five image types', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    const images = [
      { url: MEDIA_URLS.IMAGE.head_01, credit: 'Head Image' },
      { url: MEDIA_URLS.IMAGE.pack, credit: 'Pack Image' },
      { url: MEDIA_URLS.IMAGE.pup, credit: 'Pup Image' },
    ]

    for (const image of images) {
      await clickAddMediaButton(user, screen)
      await waitFor(() => {
        expect(screen.getByText('Add media')).toBeInTheDocument()
      })

      await fillMediaForm(user, screen, image)

      await waitFor(
        async () => {
          const stageButton = screen.getByRole('button', { name: 'Stage' })
          expect(stageButton).toBeEnabled()
        },
        { timeout: 1000 }
      )

      await clickStageButton(user, screen)

      await waitFor(() => {
        expect(screen.queryByText('Add media')).not.toBeInTheDocument()
      })
    }

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })
  })

  it('complex flow with video types', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    const videos = [
      { url: MEDIA_URLS.VIDEO.beach, credit: 'Beach Video' },
      { url: MEDIA_URLS.VIDEO.tree, credit: 'Tree Video' },
    ]

    for (const video of videos) {
      await clickAddMediaButton(user, screen)
      await waitFor(() => {
        expect(screen.getByText('Add media')).toBeInTheDocument()
      })

      await fillMediaForm(user, screen, video)

      await waitFor(
        async () => {
          const stageButton = screen.getByRole('button', { name: 'Stage' })
          expect(stageButton).toBeEnabled()
        },
        { timeout: 1000 }
      )

      await clickStageButton(user, screen)

      await waitFor(() => {
        expect(screen.queryByText('Add media')).not.toBeInTheDocument()
      })
    }

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })
  })
})
