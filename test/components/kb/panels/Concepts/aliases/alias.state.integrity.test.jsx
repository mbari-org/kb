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
  clickStageButton,
  clickDiscardAllButton,
  confirmDiscard,
} from '../ConceptPanelTestWrapper'

const cloneAliases = aliases => aliases.map(item => ({ ...item }))

const waitForStageEnabled = async () => {
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Stage' })).toBeEnabled()
  })
}

const getAliasActionElements = label => {
  const byLabel = screen.queryAllByLabelText(new RegExp(label, 'i'))
  if (byLabel.length > 0) {
    return byLabel
  }

  const titleMatches = Array.from(document.querySelectorAll('[title]')).filter(
    element => element.getAttribute('title')?.toLowerCase() === label.toLowerCase()
  )
  if (titleMatches.length > 0) {
    return titleMatches
  }

  return []
}

const clickAliasAction = async (user, label, index = 0) => {
  await waitFor(() => {
    expect(getAliasActionElements(label).length).toBeGreaterThan(index)
  })

  const actionElement = getAliasActionElements(label)[index]
  await user.click(actionElement)
}

const ConceptAliasStateProbe = ({ onChange }) => {
  const { initialState, stagedState } = useContext(ConceptContext)

  useEffect(() => {
    onChange({
      initialAliases: cloneAliases(initialState?.aliases || []),
      stagedAliases: cloneAliases(stagedState?.aliases || []),
    })
  }, [initialState, onChange, stagedState])

  return null
}

describe('Alias state integrity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('staging an added alias records ALIAS.ADD with expected fields', async () => {
    const user = userEvent.setup()
    let latestState = { initialAliases: [], stagedAliases: [] }

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
        <ConceptAliasStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickAliasAction(user, 'Add alias')

    await waitFor(() => {
      expect(screen.getByText('Add alias')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'dingo-common')
    await user.type(screen.getByRole('textbox', { name: 'Author' }), 'tester')

    await waitForStageEnabled()
    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add alias')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      const alias = latestState.stagedAliases.find(item => item.name === 'dingo-common')
      expect(alias).toBeDefined()
      expect(alias.author).toBe('tester')
      expect(alias.action).toBe(CONCEPT_STATE.ALIAS.ADD)
    })
  })

  it('editing an existing alias records ALIAS.EDIT and updates staged values', async () => {
    const user = userEvent.setup()
    let latestState = { initialAliases: [], stagedAliases: [] }
    const initialAliases = [{ author: 'orig', id: 'alias-1', name: 'dingo', nameType: 'Common' }]

    render(
      <ConceptPanelTestWrapper initialAliases={initialAliases}>
        <Concepts />
        <ConceptAliasStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickAliasAction(user, 'Edit alias')

    await waitFor(() => {
      expect(screen.getByText('Edit alias')).toBeInTheDocument()
    })

    const nameInput = screen.getByRole('textbox', { name: 'Name' })
    await user.clear(nameInput)
    await user.type(nameInput, 'dingo-edited')
    const authorInput = screen.getByRole('textbox', { name: 'Author' })
    await user.clear(authorInput)
    await user.type(authorInput, 'editor')

    await waitForStageEnabled()
    await clickStageButton(user, screen)

    await waitFor(() => {
      const alias = latestState.stagedAliases.find(item => item.id === 'alias-1')
      expect(alias).toBeDefined()
      expect(alias.name).toBe('dingo-edited')
      expect(alias.author).toBe('editor')
      expect(alias.action).toBe(CONCEPT_STATE.ALIAS.EDIT)
    })
  })

  it('deleting an existing alias records ALIAS.DELETE without removing staged entry', async () => {
    const user = userEvent.setup()
    let latestState = { initialAliases: [], stagedAliases: [] }
    const initialAliases = [{ author: '', id: 'alias-1', name: 'dingo', nameType: 'Common' }]

    render(
      <ConceptPanelTestWrapper initialAliases={initialAliases}>
        <Concepts />
        <ConceptAliasStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickAliasAction(user, 'Delete alias')

    await waitFor(() => {
      expect(screen.getByText('Delete alias')).toBeInTheDocument()
    })

    await clickStageButton(user, screen)

    await waitFor(() => {
      const alias = latestState.stagedAliases.find(item => item.id === 'alias-1')
      expect(alias).toBeDefined()
      expect(alias.action).toBe(CONCEPT_STATE.ALIAS.DELETE)
    })
  })

  it('discard all restores staged aliases to initial aliases and clears staged actions', async () => {
    const user = userEvent.setup()
    let latestState = { initialAliases: [], stagedAliases: [] }
    const initialAliases = [{ author: 'orig', id: 'alias-1', name: 'dingo', nameType: 'Common' }]

    render(
      <ConceptPanelTestWrapper initialAliases={initialAliases}>
        <Concepts />
        <ConceptAliasStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickAliasAction(user, 'Edit alias')

    await waitFor(() => {
      expect(screen.getByText('Edit alias')).toBeInTheDocument()
    })

    const authorInput = screen.getByRole('textbox', { name: 'Author' })
    await user.clear(authorInput)
    await user.type(authorInput, 'changed')

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
      const initialNames = latestState.initialAliases.map(item => item.name).sort()
      const stagedNames = latestState.stagedAliases.map(item => item.name).sort()
      expect(stagedNames).toEqual(initialNames)
      expect(latestState.stagedAliases.every(item => item.action === CONCEPT_STATE.NO_ACTION)).toBe(true)
    })
  })
})
