import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Concepts from '@/components/kb/panels/Concepts'
import { GUARDED_ACTION } from '@/lib/constants/guardedAction'

import { ConceptPanelTestWrapper } from '../ConceptPanelTestWrapper'

const clickTemplatesInspect = async user => {
  await waitFor(() => {
    expect(screen.getAllByRole('img', { name: 'Inspect' }).length).toBeGreaterThan(1)
  })

  const inspectIcons = screen.getAllByRole('img', { name: 'Inspect' })
  await user.click(inspectIcons[1])
}

describe('Concept panel templates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders explicit templates for the selected concept', () => {
    const initialTemplates = [
      { concept: 'dingo', linkName: 'eats', toConcept: 'nil', linkValue: 'squid' },
      { concept: 'object', linkName: 'contains', toConcept: 'nil', linkValue: 'sand' },
    ]

    render(
      <ConceptPanelTestWrapper initialTemplates={initialTemplates}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.getByText('eats | nil | squid')).toBeInTheDocument()
    expect(screen.queryByText('contains | nil | sand')).not.toBeInTheDocument()
  })

  it('inspect action routes to templates panel and sets concept filter when safe', async () => {
    const user = userEvent.setup()
    const onUpdateSelected = vi.fn()
    const onUpdateSettings = vi.fn()
    const onSetGuardedAction = vi.fn()

    render(
      <ConceptPanelTestWrapper
        onUpdateSelected={onUpdateSelected}
        onUpdateSettings={onUpdateSettings}
        onSetGuardedAction={onSetGuardedAction}
      >
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await clickTemplatesInspect(user)

    await waitFor(() => {
      expect(onUpdateSelected).toHaveBeenCalledWith({ panel: 'Templates' })
    })
    expect(onUpdateSettings).toHaveBeenCalledWith({
      templates: {
        filters: { concept: 'dingo' },
      },
    })
    expect(onSetGuardedAction).not.toHaveBeenCalled()
  })

  it('inspect action is guarded when there are unsaved concept changes', async () => {
    const user = userEvent.setup()
    const onUpdateSelected = vi.fn()
    const onUpdateSettings = vi.fn()
    const onSetGuardedAction = vi.fn()

    render(
      <ConceptPanelTestWrapper
        hasUnsavedChanges={true}
        onSetGuardedAction={onSetGuardedAction}
        onUpdateSelected={onUpdateSelected}
        onUpdateSettings={onUpdateSettings}
      >
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    await clickTemplatesInspect(user)

    await waitFor(() => {
      expect(onSetGuardedAction).toHaveBeenCalledWith({
        type: GUARDED_ACTION.CHANGE_PANEL,
        payload: {
          panel: 'Templates',
          settings: {
            templates: {
              filters: { concept: 'dingo' },
            },
          },
        },
      })
    })
    expect(onUpdateSelected).not.toHaveBeenCalled()
    expect(onUpdateSettings).not.toHaveBeenCalled()
  })
})
