import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Concepts from '@/components/kb/panels/Concepts'
import { GUARDED_ACTION } from '@/lib/constants/guardedAction'
import { SELECTED } from '@/lib/constants/selected.js'
import CONFIG from '@/lib/config'

import { ConceptPanelTestWrapper } from '../concept.panel.test.wrapper'

const clickTemplatesInspect = async user => {
  await waitFor(() => {
    expect(screen.getAllByRole('img', { name: CONFIG.UI.ICON.INSPECT }).length).toBeGreaterThan(1)
  })

  const inspectIcons = screen.getAllByRole('img', { name: CONFIG.UI.ICON.INSPECT })
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
      expect(onUpdateSelected).toHaveBeenCalledWith({ panel: SELECTED.PANELS.TEMPLATES })
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
          panel: SELECTED.PANELS.TEMPLATES,
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
