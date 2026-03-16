import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Concepts from '@/components/kb/panels/Concepts'

import {
  ConceptPanelTestWrapper,
  MEDIA_URLS,
  enterEditMode,
  clickAddMediaButton,
  fillMediaForm,
  togglePrimaryCheckbox,
  clickStageButton,
} from '../ConceptPanelTestWrapper'

vi.mock('@/lib/model/media', async importOriginal => {
  const original = await importOriginal()
  return {
    ...original,
    checkMediaUrlExists: vi.fn(() => Promise.resolve(true)),
  }
})

describe('Media Add - Image Types', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds a single image with URL and credit', async () => {
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
      credit: 'Wildlife Photographer',
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

  it('adds image with URL, credit, and caption', async () => {
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
      url: MEDIA_URLS.IMAGE.pack,
      credit: 'Nature Documentary',
      caption: 'Pack of dingos hunting at sunset',
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
  })

  it('adds image with primary designation enabled', async () => {
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
      url: MEDIA_URLS.IMAGE.pup,
      credit: 'Wildlife Journal',
    })

    const primaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(primaryCheckbox).toBeChecked()

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

  it('adds multiple images sequentially', async () => {
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
      url: MEDIA_URLS.IMAGE.side_01,
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

    await clickAddMediaButton(user, screen)
    await waitFor(() => {
      expect(screen.getByText('Add media')).toBeInTheDocument()
    })

    await fillMediaForm(user, screen, {
      url: MEDIA_URLS.IMAGE.side_02,
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

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })
  })

  it('validates that first image of type is automatically set as primary', async () => {
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
      credit: 'Test Credit',
    })

    const primaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(primaryCheckbox).toBeChecked()
    expect(primaryCheckbox).toBeDisabled()
  })
})

describe('Media Add - Video Types', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds a video with MOV extension', async () => {
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
      credit: 'Beach Documentary',
      caption: 'Dingos on the beach',
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
  })

  it('adds a video with MP4 extension', async () => {
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
      url: MEDIA_URLS.VIDEO.tree,
      credit: 'Nature Film',
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
  })

  it('adds multiple videos and verifies primary assignment', async () => {
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
      credit: 'Beach Credit',
    })

    const firstPrimaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(firstPrimaryCheckbox).toBeChecked()
    expect(firstPrimaryCheckbox).toBeDisabled()

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
      url: MEDIA_URLS.VIDEO.tree,
      credit: 'Tree Credit',
    })

    const secondPrimaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(secondPrimaryCheckbox).not.toBeChecked()
    expect(secondPrimaryCheckbox).toBeEnabled()

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

describe('Media Add - Icon Types', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds an icon with ICO extension', async () => {
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
      url: MEDIA_URLS.ICON.dingosky,
      credit: 'Dingosky Logo',
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
  })
})

describe('Media Add - Mixed Media Types', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds image, video, and icon sequentially - each type gets its own primary', async () => {
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

    let primaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(primaryCheckbox).toBeChecked()

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

    primaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(primaryCheckbox).toBeChecked()

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

    primaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(primaryCheckbox).toBeChecked()

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

  it('adds second image after video - second image is not auto-primary', async () => {
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
      url: MEDIA_URLS.VIDEO.beach,
      credit: 'Video',
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

    const primaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(primaryCheckbox).not.toBeChecked()
    expect(primaryCheckbox).toBeEnabled()
  })
})

describe('Media Add - Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stage button is disabled when URL is empty', async () => {
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

    const urlInput = screen.getByRole('textbox', { name: /url/i })
    expect(urlInput).toHaveValue('')

    const stageButton = screen.getByRole('button', { name: 'Stage' })
    expect(stageButton).toBeDisabled()
  })

  it('stage button is disabled when credit is empty', async () => {
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

    const urlInput = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlInput, MEDIA_URLS.IMAGE.head_01)

    await waitFor(() => {
      const stageButton = screen.getByRole('button', { name: 'Stage' })
      expect(stageButton).toBeDisabled()
    })
  })

  it('shows error for invalid URL format', async () => {
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

    const urlInput = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlInput, 'not-a-valid-url')

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument()
    })
  })

  it('discard button closes modal without staging', async () => {
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

    expect(screen.queryByRole('button', { name: 'Discard All' })).not.toBeInTheDocument()
  })

  it('shows error for invalid URL format when typing', async () => {
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

    const urlInput = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlInput, 'invalid')

    await waitFor(
      () => {
        expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('stage button remains disabled when required fields are missing', async () => {
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

    const urlInput = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlInput, MEDIA_URLS.IMAGE.head_01)

    const stageButton = screen.getByRole('button', { name: 'Stage' })
    expect(stageButton).toBeDisabled()
  })
})

describe('Media Add - Primary Designation Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adding second media of same type allows toggling primary', async () => {
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
      credit: 'First',
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
      credit: 'Second',
    })

    const primaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(primaryCheckbox).not.toBeChecked()
    expect(primaryCheckbox).toBeEnabled()

    await togglePrimaryCheckbox(user, screen)
    expect(primaryCheckbox).toBeChecked()
  })

  it('setting second media as primary when adding', async () => {
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

    await togglePrimaryCheckbox(user, screen)

    const primaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
    expect(primaryCheckbox).toBeChecked()

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
