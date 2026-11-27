import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import Concepts from '@/components/kb/panels/Concepts'
import CONFIG from '@/lib/config'
import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField'
import { ConceptPanelTestWrapper } from '../concept.panel.test.wrapper'

const REALIZATION_VIEW = CONFIG.PANELS.CONCEPTS.MODALS.REALIZATION.VIEW

vi.mock('@/config/panels/concepts/realizations.json', async importOriginal => {
  const original = await importOriginal()
  return { default: { ...original.default, LABEL: 'Configured realization heading' } }
})

describe('Concept realizations', () => {
  it('uses the configured section label', () => {
    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.getByRole('heading', { level: 6, name: CONFIG.PANELS.CONCEPTS.REALIZATIONS.LABEL }))
      .toBeInTheDocument()
  })

  it('clicking a realization linkName opens the view modal', async () => {
    const user = userEvent.setup()
    const initialRealizations = [{ linkName: 'predatorOf', toConcept: 'nil', linkValue: 'fish' }]

    render(
      <ConceptPanelTestWrapper initialRealizations={initialRealizations}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await user.click(screen.getByRole('button', { name: REALIZATION_VIEW.ARIA_LABEL }))
    expect(await screen.findByText(REALIZATION_VIEW.TITLE)).toBeInTheDocument()
  })

  it('clicking a pending realization does not open the view modal', async () => {
    const user = userEvent.setup()
    const initialRealizations = [{ linkName: 'predatorOf', toConcept: 'nil', linkValue: 'fish' }]
    const initialPendingConcept = [
      {
        id: 99,
        concept: 'dingo',
        field: HISTORY_FIELD.REALIZATION,
        action: ACTION.DELETE,
        oldValue: 'predatorOf | nil | fish',
        newValue: null,
      },
    ]

    render(
      <ConceptPanelTestWrapper
        initialRealizations={initialRealizations}
        initialPendingConcept={initialPendingConcept}
      >
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await user.click(screen.getByRole('button', { name: REALIZATION_VIEW.ARIA_LABEL }))
    expect(screen.queryByText(REALIZATION_VIEW.TITLE)).not.toBeInTheDocument()
  })
})
