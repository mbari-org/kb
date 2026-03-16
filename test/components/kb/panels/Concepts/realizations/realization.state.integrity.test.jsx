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

const cloneRealizations = realizations => realizations.map(item => ({ ...item }))

const waitForStageEnabled = async () => {
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Stage' })).toBeEnabled()
  })
}

const getRealizationActionElements = label => {
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

const clickRealizationAction = async (user, label, index = 0) => {
  await waitFor(() => {
    expect(getRealizationActionElements(label).length).toBeGreaterThan(index)
  })

  const actionElement = getRealizationActionElements(label)[index]
  await user.click(actionElement)
}

const ConceptRealizationStateProbe = ({ onChange }) => {
  const { initialState, stagedState } = useContext(ConceptContext)

  useEffect(() => {
    onChange({
      initialRealizations: cloneRealizations(initialState?.realizations || []),
      stagedRealizations: cloneRealizations(stagedState?.realizations || []),
    })
  }, [initialState, onChange, stagedState])

  return null
}

describe('Realization state integrity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('staging an added realization records REALIZATION.ADD with expected fields', async () => {
    const user = userEvent.setup()
    let latestState = { initialRealizations: [], stagedRealizations: [] }
    const initialTemplates = [
      {
        id: 'template-1',
        concept: 'dingo',
        linkName: 'predatorOf',
        toConcept: 'nil',
        linkValue: 'fish',
      },
    ]

    render(
      <ConceptPanelTestWrapper initialTemplates={initialTemplates}>
        <Concepts />
        <ConceptRealizationStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickRealizationAction(user, 'Add realization')

    await waitFor(() => {
      expect(screen.getByText('Add realization')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'predatorOf' }))

    await waitForStageEnabled()
    await clickStageButton(user, screen)

    await waitFor(() => {
      expect(screen.queryByText('Add realization')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      const realization = latestState.stagedRealizations.find(item => item.linkName === 'predatorOf')
      expect(realization).toBeDefined()
      expect(realization.toConcept).toBe('nil')
      expect(realization.linkValue).toBe('fish')
      expect(realization.action).toBe(CONCEPT_STATE.REALIZATION.ADD)
    })
  })

  it('editing an existing realization records REALIZATION.EDIT and updates staged values', async () => {
    const user = userEvent.setup()
    let latestState = { initialRealizations: [], stagedRealizations: [] }
    const initialRealizations = [{ linkName: 'predatorOf', toConcept: 'nil', linkValue: 'fish' }]
    const initialTemplates = [
      { id: 'template-1', concept: 'dingo', linkName: 'predatorOf', toConcept: 'nil', linkValue: 'fish' },
    ]

    render(
      <ConceptPanelTestWrapper initialRealizations={initialRealizations} initialTemplates={initialTemplates}>
        <Concepts />
        <ConceptRealizationStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickRealizationAction(user, 'Edit realization')

    await waitFor(() => {
      expect(screen.getByText('Edit realization')).toBeInTheDocument()
    })

    const linkValueInput = screen.getByRole('textbox', { name: 'Link Value' })
    await user.clear(linkValueInput)
    await user.type(linkValueInput, 'squid')

    await waitForStageEnabled()
    await clickStageButton(user, screen)

    await waitFor(() => {
      const realization = latestState.stagedRealizations.find(item => item.linkName === 'predatorOf')
      expect(realization).toBeDefined()
      expect(realization.linkValue).toBe('squid')
      expect(realization.action).toBe(CONCEPT_STATE.REALIZATION.EDIT)
    })
  })

  it('deleting an existing realization records REALIZATION.DELETE without removing staged entry', async () => {
    const user = userEvent.setup()
    let latestState = { initialRealizations: [], stagedRealizations: [] }
    const initialRealizations = [{ linkName: 'predatorOf', toConcept: 'nil', linkValue: 'fish' }]

    render(
      <ConceptPanelTestWrapper initialRealizations={initialRealizations}>
        <Concepts />
        <ConceptRealizationStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickRealizationAction(user, 'Delete realization')

    await waitFor(() => {
      expect(screen.getByText('Delete realization')).toBeInTheDocument()
    })

    await clickStageButton(user, screen)

    await waitFor(() => {
      const realization = latestState.stagedRealizations.find(item => item.linkName === 'predatorOf')
      expect(realization).toBeDefined()
      expect(realization.action).toBe(CONCEPT_STATE.REALIZATION.DELETE)
    })
  })

  it('discard all restores staged realizations to initial realizations and clears staged actions', async () => {
    const user = userEvent.setup()
    let latestState = { initialRealizations: [], stagedRealizations: [] }
    const initialRealizations = [{ linkName: 'predatorOf', toConcept: 'nil', linkValue: 'fish' }]
    const initialTemplates = [
      { id: 'template-1', concept: 'dingo', linkName: 'predatorOf', toConcept: 'nil', linkValue: 'fish' },
    ]

    render(
      <ConceptPanelTestWrapper initialRealizations={initialRealizations} initialTemplates={initialTemplates}>
        <Concepts />
        <ConceptRealizationStateProbe
          onChange={state => {
            latestState = state
          }}
        />
      </ConceptPanelTestWrapper>
    )

    await enterEditMode(user, screen)
    await clickRealizationAction(user, 'Edit realization')

    await waitFor(() => {
      expect(screen.getByText('Edit realization')).toBeInTheDocument()
    })

    const linkValueInput = screen.getByRole('textbox', { name: 'Link Value' })
    await user.clear(linkValueInput)
    await user.type(linkValueInput, 'squid')

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
      const initialTriples = latestState.initialRealizations
        .map(item => `${item.linkName}|${item.toConcept}|${item.linkValue}`)
        .sort()
      const stagedTriples = latestState.stagedRealizations
        .map(item => `${item.linkName}|${item.toConcept}|${item.linkValue}`)
        .sort()
      expect(stagedTriples).toEqual(initialTriples)
      expect(latestState.stagedRealizations.every(item => item.action === CONCEPT_STATE.NO_ACTION)).toBe(true)
    })
  })
})
