import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import Concepts from '@/components/kb/panels/Concepts'
import { ROLES } from '@/lib/constants/roles.js'

import { ConceptPanelTestWrapper } from './concept.panel.test.wrapper'
import CONFIG from '@/lib/config'

const BUTTON = CONFIG.BUTTON

const pendingNameItem = {
  id: 1,
  concept: 'dingo',
  field: 'Concept.name',
  action: 'Replace',
  oldValue: 'dingo',
  newValue: 'wolf',
  creatorName: 'brian',
  creationTimestamp: '2024-06-06T19:44:00Z',
}

describe('Concept panel with pending history', () => {
  it('shows an enabled Pending button instead of Edit for admin users', () => {
    render(
      <ConceptPanelTestWrapper userRole={ROLES.ADMIN} initialPendingConcept={[pendingNameItem]}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.getByRole('button', { name: BUTTON.PENDING })).toBeEnabled()
    expect(screen.queryByRole('button', { name: BUTTON.EDIT })).not.toBeInTheDocument()
  })

  it('shows an enabled Pending button for read-only users', () => {
    render(
      <ConceptPanelTestWrapper userRole={ROLES.READ_ONLY} initialPendingConcept={[pendingNameItem]}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.getByRole('button', { name: BUTTON.PENDING })).toBeEnabled()
    expect(screen.queryByRole('button', { name: BUTTON.EDIT })).not.toBeInTheDocument()
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
