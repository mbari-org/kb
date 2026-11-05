import { useContext, useEffect } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Concepts from '@/components/kb/panels/Concepts'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'
import { ROLES } from '@/lib/constants/roles'
import {
  ConceptPanelTestWrapper,
  enterEditMode,
  clickDiscardAllButton,
  confirmDiscard,
} from '../concept.panel.test.wrapper'
import CONFIG from '@/lib/config'

const BUTTON = CONFIG.BUTTON

const selectRankOption = async (user, label, option) => {
  const select = screen.getByRole('combobox', { name: label })
  await user.click(select)

  await waitFor(() => {
    expect(screen.getByRole('option', { name: option })).toBeInTheDocument()
  })
  await user.click(screen.getByRole('option', { name: option }))
}

const ConceptRankStateProbe = ({ onChange }) => {
  const { initialState } = useContext(ConceptContext)
  const { stagedState } = useContext(ConceptStagedContext)

  useEffect(() => {
    onChange({
      initialRank: { ...(initialState?.rank || {}) },
      stagedRank: { ...(stagedState?.rank || {}) },
    })
  }, [initialState, onChange, stagedState])

  return null
}

describe('Rank state integrity', () => {
  const taxonomyRanks = [
    { rankLevel: '', rankName: 'Mammalia' },
    { rankLevel: '', rankName: 'Aves' },
    { rankLevel: 'Class', rankName: 'Mammalia' },
    { rankLevel: 'Class', rankName: 'Aves' },
    { rankLevel: 'Subclass', rankName: 'Aves' },
    { rankLevel: 'Order', rankName: 'Reptilia' },
  ]

  const initialRank = { level: 'Class', name: 'Mammalia' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hides rank fields when concept is not under phylogeny root setting', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper initialRank={initialRank} isPhylogenyRoot={false} taxonomyRanks={taxonomyRanks}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    expect(screen.queryByRole('combobox', { name: 'Name' })).not.toBeInTheDocument()
    expect(screen.queryByRole('combobox', { name: 'Level' })).not.toBeInTheDocument()
  })

  it('shows rank fields when concept is under phylogeny root setting', () => {
    render(
      <ConceptPanelTestWrapper initialRank={initialRank} isPhylogenyRoot taxonomyRanks={taxonomyRanks}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.getByRole('combobox', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Level' })).toBeInTheDocument()
  })

  it('allows reverting rank name back to the initial value', async () => {
    const user = userEvent.setup()
    let latestState = { initialRank: {}, stagedRank: {} }

    render(
      <ConceptPanelTestWrapper initialRank={initialRank} isPhylogenyRoot taxonomyRanks={taxonomyRanks}>
        <Concepts />
        <ConceptRankStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await selectRankOption(user, 'Name', 'Aves')
    await waitFor(() => {
      expect(latestState.stagedRank.name).toBe('Aves')
      expect(latestState.stagedRank.action).toBe(CONCEPT_STATE.RANK)
    })

    await selectRankOption(user, 'Name', 'Mammalia')
    await waitFor(() => {
      expect(latestState.stagedRank.name).toBe('Mammalia')
      expect(latestState.stagedRank.level).toBe('Class')
      expect(latestState.stagedRank.action).toBe(CONCEPT_STATE.NO_ACTION)
    })
  })

  it('allows reverting one rank field while the other stays modified', async () => {
    const user = userEvent.setup()
    let latestState = { initialRank: {}, stagedRank: {} }

    render(
      <ConceptPanelTestWrapper initialRank={initialRank} isPhylogenyRoot taxonomyRanks={taxonomyRanks}>
        <Concepts />
        <ConceptRankStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await selectRankOption(user, 'Name', 'Aves')
    await selectRankOption(user, 'Level', 'Subclass')
    await waitFor(() => {
      expect(latestState.stagedRank.name).toBe('Aves')
      expect(latestState.stagedRank.level).toBe('Subclass')
    })

    await selectRankOption(user, 'Level', 'Class')
    await waitFor(() => {
      expect(latestState.stagedRank.level).toBe('Class')
      expect(latestState.stagedRank.name).toBe('Aves')
      expect(latestState.stagedRank.action).toBe(CONCEPT_STATE.RANK)
    })
  })

  it('lists all rank names regardless of the current level', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper initialRank={initialRank} isPhylogenyRoot taxonomyRanks={taxonomyRanks}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    // Reptilia only pairs with level Order; the Name dropdown must still offer it
    await user.click(screen.getByRole('combobox', { name: 'Name' }))
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Reptilia' })).toBeInTheDocument()
    })
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('keeps Rank Level when the selected name supports it', async () => {
    const user = userEvent.setup()
    let latestState = { initialRank: {}, stagedRank: {} }

    render(
      <ConceptPanelTestWrapper initialRank={initialRank} isPhylogenyRoot taxonomyRanks={taxonomyRanks}>
        <Concepts />
        <ConceptRankStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await selectRankOption(user, 'Name', 'Aves')
    await waitFor(() => {
      expect(latestState.stagedRank.name).toBe('Aves')
      expect(latestState.stagedRank.level).toBe('Class')
    })
  })

  it('clears Rank Level when the selected name does not support it', async () => {
    const user = userEvent.setup()
    let latestState = { initialRank: {}, stagedRank: {} }

    render(
      <ConceptPanelTestWrapper initialRank={initialRank} isPhylogenyRoot taxonomyRanks={taxonomyRanks}>
        <Concepts />
        <ConceptRankStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await selectRankOption(user, 'Name', 'Reptilia')
    await waitFor(() => {
      expect(latestState.stagedRank.name).toBe('Reptilia')
      expect(latestState.stagedRank.level).toBe('')
      expect(latestState.stagedRank.action).toBe(CONCEPT_STATE.RANK)
    })
  })

  it('omits the blank option from rank dropdowns', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper initialRank={initialRank} isPhylogenyRoot taxonomyRanks={taxonomyRanks}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await user.click(screen.getByRole('combobox', { name: 'Level' }))
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Class' })).toBeInTheDocument()
    })
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })

  it('clears only Rank Level with its clear button', async () => {
    const user = userEvent.setup()
    let latestState = { initialRank: {}, stagedRank: {} }

    render(
      <ConceptPanelTestWrapper initialRank={initialRank} isPhylogenyRoot taxonomyRanks={taxonomyRanks}>
        <Concepts />
        <ConceptRankStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await selectRankOption(user, 'Name', 'Aves')
    await selectRankOption(user, 'Level', 'Subclass')
    await waitFor(() => {
      expect(latestState.stagedRank.level).toBe('Subclass')
    })

    await user.click(screen.getByRole('button', { name: 'Clear Rank Level' }))
    await waitFor(() => {
      expect(latestState.stagedRank.level).toBe('')
      expect(latestState.stagedRank.name).toBe('Aves')
      expect(latestState.stagedRank.action).toBe(CONCEPT_STATE.RANK)
    })
  })

  it('clears both rank fields with the Rank Name clear button', async () => {
    const user = userEvent.setup()
    let latestState = { initialRank: {}, stagedRank: {} }

    render(
      <ConceptPanelTestWrapper initialRank={initialRank} isPhylogenyRoot taxonomyRanks={taxonomyRanks}>
        <Concepts />
        <ConceptRankStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    // The Autocomplete clear indicator is visibility-hidden until the field has focus
    await user.click(screen.getByRole('combobox', { name: 'Name' }))
    await user.click(screen.getByRole('button', { name: 'Clear Rank Name' }))
    await waitFor(() => {
      expect(latestState.stagedRank.name).toBe('')
      expect(latestState.stagedRank.level).toBe('')
      expect(latestState.stagedRank.action).toBe(CONCEPT_STATE.RANK)
    })
  })

  it('gates rank fields by editing state', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper initialRank={initialRank} isPhylogenyRoot taxonomyRanks={taxonomyRanks}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.getByRole('combobox', { name: 'Name' })).toBeDisabled()
    expect(screen.getByRole('combobox', { name: 'Level' })).toBeDisabled()

    await enterEditMode(user, screen)

    expect(screen.getByRole('combobox', { name: 'Name' })).toBeEnabled()
    expect(screen.getByRole('combobox', { name: 'Level' })).toBeEnabled()
  })

  it('hides rank clear buttons when not editing', () => {
    render(
      <ConceptPanelTestWrapper initialRank={initialRank} isPhylogenyRoot taxonomyRanks={taxonomyRanks}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.queryByRole('button', { name: 'Clear Rank Name' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Clear Rank Level' })).not.toBeInTheDocument()
  })

  it('hides rank clear buttons for non-admin users', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper
        initialRank={initialRank}
        isPhylogenyRoot
        taxonomyRanks={taxonomyRanks}
        userRole={ROLES.MAINT}
      >
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    expect(screen.queryByRole('button', { name: 'Clear Rank Name' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Clear Rank Level' })).not.toBeInTheDocument()
  })

  it('updates rank name/level and discard all restores initial rank state', async () => {
    const user = userEvent.setup()
    let latestState = { initialRank: {}, stagedRank: {} }

    render(
      <ConceptPanelTestWrapper initialRank={initialRank} isPhylogenyRoot taxonomyRanks={taxonomyRanks}>
        <Concepts />
        <ConceptRankStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    await selectRankOption(user, 'Name', 'Aves')
    await selectRankOption(user, 'Level', 'Subclass')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: BUTTON.SAVE })).toBeEnabled()
      expect(latestState.stagedRank.name).toBe('Aves')
      expect(latestState.stagedRank.level).toBe('Subclass')
      expect(latestState.stagedRank.action).toBe(CONCEPT_STATE.RANK)
    })

    await clickDiscardAllButton(user, screen)
    await confirmDiscard(user, screen)

    await waitFor(() => {
      expect(latestState.stagedRank.name).toBe(initialRank.name)
      expect(latestState.stagedRank.level).toBe(initialRank.level)
      expect(latestState.stagedRank.action).toBe(CONCEPT_STATE.NO_ACTION)
    })
  })
})
