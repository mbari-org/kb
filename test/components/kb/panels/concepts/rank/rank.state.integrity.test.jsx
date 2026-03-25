import { useContext, useEffect } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Concepts from '@/components/kb/panels/Concepts'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'
import {
  ConceptPanelTestWrapper,
  enterEditMode,
  clickDiscardAllButton,
  confirmDiscard,
} from '../concept.panel.test.wrapper'

const selectRankOption = async (user, label, option) => {
  const select = screen.getByRole('combobox', { name: label })
  await user.click(select)

  await waitFor(() => {
    expect(screen.getByRole('option', { name: option })).toBeInTheDocument()
  })
  await user.click(screen.getByRole('option', { name: option }))
}

const ConceptRankStateProbe = ({ onChange }) => {
  const { initialState, stagedState } = useContext(ConceptContext)

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
    { rankLevel: 'Class', rankName: 'Mammalia' },
    { rankLevel: 'Class', rankName: 'Aves' },
    { rankLevel: 'Subclass', rankName: 'Aves' },
  ]

  const initialRank = { level: 'Class', name: 'Mammalia' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hides rank fields when concept is not under phylogeny root setting', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper
        initialRank={initialRank}
        isPhylogenyRoot={false}
        taxonomyRanks={taxonomyRanks}
      >
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)

    expect(screen.queryByRole('combobox', { name: 'Name' })).not.toBeInTheDocument()
    expect(screen.queryByRole('combobox', { name: 'Level' })).not.toBeInTheDocument()
  })

  it('shows rank fields when concept is under phylogeny root setting', () => {
    render(
      <ConceptPanelTestWrapper
        initialRank={initialRank}
        isPhylogenyRoot
        taxonomyRanks={taxonomyRanks}
      >
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.getByRole('combobox', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Level' })).toBeInTheDocument()
  })

  it('updates rank name/level and discard all restores initial rank state', async () => {
    const user = userEvent.setup()
    let latestState = { initialRank: {}, stagedRank: {} }

    render(
      <ConceptPanelTestWrapper
        initialRank={initialRank}
        isPhylogenyRoot
        taxonomyRanks={taxonomyRanks}
      >
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
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
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
