import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Concepts from '@/components/kb/panels/Concepts'

import {
  ConceptPanelTestWrapper,
  MEDIA_URLS,
  createMediaItem,
  enterEditMode,
  clickEditMediaButton,
  fillMediaForm,
  togglePrimaryCheckbox,
  clickStageButton,
  clickDiscardButton,
} from '../concept.panel.test.wrapper'

vi.mock('@/lib/model/media', async importOriginal => {
  const original = await importOriginal()
  return {
    ...original,
    checkMediaUrlExists: vi.fn(() => Promise.resolve(true)),
  }
})

describe('Media Edit - URL Changes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('edits URL of existing image media', async () => {
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

    const urlInput = screen.getByRole('textbox', { name: /url/i })
    expect(urlInput).toHaveValue(MEDIA_URLS.IMAGE.head_01)

    await user.clear(urlInput)
    await user.type(urlInput, MEDIA_URLS.IMAGE.pack)

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

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })
  })

  it('edits URL from image to video type', async () => {
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
  })

  it('edits URL from video to image type', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.VIDEO.beach,
        credit: 'Video Credit',
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
      url: MEDIA_URLS.IMAGE.pup,
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
  })

  it('edits URL from image to icon type', async () => {
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
    await clickEditMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Edit media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.ICON.dingosky,
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
  })
})

describe('Media Edit - Credit Changes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('edits credit of existing media', async () => {
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

    const creditInput = screen.getByRole('textbox', { name: /credit/i })
    expect(creditInput).toHaveValue('Original Credit')

    await user.clear(creditInput)
    await user.type(creditInput, 'Updated Credit by New Photographer')

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

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })
  })

  it('shows error when credit is cleared', async () => {
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

    const creditInput = screen.getByRole('textbox', { name: /credit/i })
    await user.clear(creditInput)

    await waitFor(() => {
      expect(screen.getByText(/credit cannot be empty/i)).toBeInTheDocument()
    })

    const stageButton = screen.getByRole('button', { name: 'Stage' })
    expect(stageButton).toBeDisabled()
  })
})

describe('Media Edit - Caption Changes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds caption to media that has none', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Original Credit',
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
    await clickEditMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Edit media')).toBeInTheDocument()
    })

    const captionInput = screen.getByRole('textbox', { name: /caption/i })
    expect(captionInput).toHaveValue('')

    await user.type(captionInput, 'A beautiful dingo portrait')

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
  })

  it('edits existing caption', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Original Credit',
        caption: 'Original Caption',
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

    const captionInput = screen.getByRole('textbox', { name: /caption/i })
    expect(captionInput).toHaveValue('Original Caption')

    await user.clear(captionInput)
    await user.type(captionInput, 'Updated Caption with More Details')

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
  })

  it('removes caption from media', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Original Credit',
        caption: 'Caption to Remove',
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

    const captionInput = screen.getByRole('textbox', { name: /caption/i })
    await user.clear(captionInput)

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
  })
})

describe('Media Edit - Primary Designation Changes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('cannot toggle primary when only one media of type exists', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Solo Image',
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

    const primaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(primaryCheckbox).toBeChecked()
    expect(primaryCheckbox).toBeDisabled()
  })

  it('toggles primary from true to false when multiple media of same type', async () => {
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
    await clickEditMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Edit media')).toBeInTheDocument()
    })

    const primaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(primaryCheckbox).toBeChecked()
    expect(primaryCheckbox).toBeEnabled()

    await togglePrimaryCheckbox(user, screen)
    expect(primaryCheckbox).not.toBeChecked()

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
  })

  it('toggles primary from false to true on non-primary media', async () => {
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
    await clickEditMediaButton(user, screen)

    await waitFor(() => {
      expect(screen.getByText('Edit media')).toBeInTheDocument()
    })

    const urlInput = screen.getByRole('textbox', { name: /url/i })
    expect(urlInput.value).toBeTruthy()
  })
})

describe('Media Edit - Combined Field Changes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('edits URL and credit simultaneously', async () => {
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
      url: MEDIA_URLS.IMAGE.pup,
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
      expect(screen.queryByText('Edit media')).not.toBeInTheDocument()
    })
  })

  it('edits URL, credit, and caption simultaneously', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Original Credit',
        caption: 'Original Caption',
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
      url: MEDIA_URLS.VIDEO.tree,
      credit: 'New Video Credit',
      caption: 'New Video Caption',
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
  })

  it('edits all fields including primary', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.IMAGE.head_01,
        credit: 'Primary Image Credit',
        caption: 'Primary Caption',
        isPrimary: true,
        id: 'media-1',
      }),
      createMediaItem({
        url: MEDIA_URLS.IMAGE.pack,
        credit: 'Secondary Image Credit',
        caption: 'Secondary Caption',
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

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.side_01,
      credit: 'Completely New Credit',
      caption: 'Completely New Caption',
    })

    await togglePrimaryCheckbox(user, screen)

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
  })
})

describe('Media Edit - Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stage button disabled when URL is emptied', async () => {
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

    const urlInput = screen.getByRole('textbox', { name: /url/i })
    await user.clear(urlInput)

    await waitFor(() => {
      expect(screen.getByText(/url cannot be empty/i)).toBeInTheDocument()
    })

    const stageButton = screen.getByRole('button', { name: 'Stage' })
    expect(stageButton).toBeDisabled()
  })

  it('shows error for invalid URL when editing', async () => {
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

    const urlInput = screen.getByRole('textbox', { name: /url/i })
    await user.clear(urlInput)
    await user.type(urlInput, 'invalid-url-format')

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument()
    })
  })

  it('discard button closes modal without saving changes', async () => {
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
      credit: 'Modified Credit That Should Not Save',
    })

    await clickDiscardButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Edit media')).not.toBeInTheDocument()
    })

    expect(screen.queryByRole('button', { name: 'Discard All' })).not.toBeInTheDocument()
  })

  it('stage button disabled when no changes made', async () => {
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

    const stageButton = screen.getByRole('button', { name: 'Stage' })
    expect(stageButton).toBeDisabled()
  })
})

describe('Media Edit - Video Types', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('edits video URL to different video', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.VIDEO.beach,
        credit: 'Beach Video Credit',
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
      url: MEDIA_URLS.VIDEO.tree,
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
  })

  it('edits video credit and caption', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.VIDEO.tree,
        credit: 'Original Video Credit',
        caption: 'Original Video Caption',
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
      credit: 'Updated Documentary Credit',
      caption: 'Dingos climbing trees at dawn',
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
  })
})

describe('Media Edit - Icon Types', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('edits icon credit', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.ICON.dingosky,
        credit: 'Original Icon Credit',
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
      credit: 'Dingosky Official Logo',
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
  })

  it('changes icon to image type', async () => {
    const user = userEvent.setup()

    const initialMedia = [
      createMediaItem({
        url: MEDIA_URLS.ICON.dingosky,
        credit: 'Icon Credit',
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
      url: MEDIA_URLS.IMAGE.head_01,
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
  })
})
