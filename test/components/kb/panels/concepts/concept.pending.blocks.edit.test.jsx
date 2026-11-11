import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Concepts from '@/components/kb/panels/Concepts'
import { ACTION, HISTORY_FIELD } from '@/lib/constants'
import { ROLES } from '@/lib/constants/roles.js'

import { ConceptPanelTestWrapper } from './concept.panel.test.wrapper'
import CONFIG from '@/lib/config'

const BUTTON = CONFIG.BUTTON

const pendingNameItem = {
  id: 1,
  concept: 'dingo',
  field: HISTORY_FIELD.NAME,
  action: ACTION.EDIT,
  oldValue: 'wolf',
  newValue: 'dingo',
  creatorName: 'brian',
  creationTimestamp: '2024-06-06T19:44:00Z',
}

const pendingDelete = {
  id: 2,
  concept: 'root',
  field: HISTORY_FIELD.CHILD,
  action: ACTION.DELETE,
  oldValue: 'dingo',
}

describe('Concept panel with pending history', () => {
  it('shows Edit and Pending for other pending actions and opens pending history', async () => {
    const user = userEvent.setup()
    render(
      <ConceptPanelTestWrapper
        userRole={ROLES.ADMIN}
        initialPendingConcept={[pendingNameItem]}
        initialPendingHistory={[pendingNameItem]}
      >
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    const edit = screen.getByRole('button', { name: BUTTON.EDIT })
    const pending = screen.getByRole('button', { name: BUTTON.PENDING })
    const save = screen.getByRole('button', { name: BUTTON.SAVE })
    expect(edit.compareDocumentPosition(pending) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(pending.compareDocumentPosition(save) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    await user.click(pending)
    expect(screen.getByText(CONFIG.PANELS.CONCEPTS.MODALS.PENDING.DESCRIPTION)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: BUTTON.CLOSE }))

    await user.click(edit)
    expect(screen.getByRole('button', { name: BUTTON.CANCEL })).toBeEnabled()
    expect(screen.queryByRole('button', { name: BUTTON.PENDING })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: BUTTON.CANCEL }))
    expect(screen.getByRole('button', { name: BUTTON.PENDING })).toBeEnabled()
  })

  it.each([ROLES.ADMIN, ROLES.READ_ONLY])('shows Pending for a pending Concept deletion for %s users', userRole => {
    render(
      <ConceptPanelTestWrapper userRole={userRole} initialPendingHistory={[pendingDelete]}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.getByRole('button', { name: BUTTON.PENDING })).toBeEnabled()
    expect(screen.queryByRole('button', { name: BUTTON.EDIT })).not.toBeInTheDocument()
  })

  it('shows Pending but not Edit for read-only users with other pending actions', () => {
    render(
      <ConceptPanelTestWrapper
        userRole={ROLES.READ_ONLY}
        initialPendingConcept={[pendingNameItem]}
        initialPendingHistory={[pendingNameItem]}
      >
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.queryByRole('button', { name: BUTTON.EDIT })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: BUTTON.PENDING })).toBeEnabled()
  })

  it('shows Edit when the concept has no pending history', () => {
    render(
      <ConceptPanelTestWrapper userRole={ROLES.ADMIN}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.getByRole('button', { name: BUTTON.EDIT })).toBeEnabled()
    expect(screen.queryByRole('button', { name: BUTTON.PENDING })).not.toBeInTheDocument()
  })
})
