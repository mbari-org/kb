import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Concepts from '@/components/kb/panels/Concepts'
import { GUARDED_ACTION } from '@/lib/constants/guardedAction'

import { ConceptPanelTestWrapper } from '../concept.panel.test.wrapper'

const clickReferencesInspect = async user => {
  await waitFor(() => {
    expect(screen.getAllByRole('img', { name: 'Inspect' }).length).toBeGreaterThan(0)
  })

  const inspectIcons = screen.getAllByRole('img', { name: 'Inspect' })
  await user.click(inspectIcons[0])
}

describe('Concept panel references', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders references returned for the selected concept', () => {
    const initialReferences = [
      { doi: 'https://doi.org/10.1000/first', citation: 'First Reference Citation' },
      { doi: 'https://doi.org/10.1000/second', citation: 'Second Reference Citation' },
    ]

    render(
      <ConceptPanelTestWrapper initialReferences={initialReferences}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.getByText('First Reference Citation')).toBeInTheDocument()
    expect(screen.getByText('Second Reference Citation')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'First Reference Citation' })).toHaveAttribute(
      'href',
      'https://doi.org/10.1000/first'
    )
    expect(screen.getByRole('link', { name: 'Second Reference Citation' })).toHaveAttribute(
      'href',
      'https://doi.org/10.1000/second'
    )
  })

  it('inspect action routes to references panel and sets by-concept filter when safe', async () => {
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

    await clickReferencesInspect(user)

    await waitFor(() => {
      expect(onUpdateSelected).toHaveBeenCalledWith({ panel: 'References' })
    })
    expect(onUpdateSettings).toHaveBeenCalledWith({
      references: { byConcept: true },
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

    await clickReferencesInspect(user)

    await waitFor(() => {
      expect(onSetGuardedAction).toHaveBeenCalledWith({
        type: GUARDED_ACTION.CHANGE_PANEL,
        payload: {
          panel: 'References',
          settings: {
            references: { byConcept: true },
          },
        },
      })
    })
    expect(onUpdateSelected).not.toHaveBeenCalled()
    expect(onUpdateSettings).not.toHaveBeenCalled()
  })
})
