import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import Concepts from '@/components/kb/panels/Concepts'
import { ROLES } from '@/lib/constants/roles.js'

import { ConceptPanelTestWrapper } from './ConceptPanelTestWrapper'

describe('Concepts panel READ_ONLY restrictions', () => {
  it('does not show the Edit button for READ_ONLY users', () => {
    render(
      <ConceptPanelTestWrapper userRole={ROLES.READ_ONLY}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
  })

  it('does not show the Save button for READ_ONLY users', () => {
    render(
      <ConceptPanelTestWrapper userRole={ROLES.READ_ONLY}>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
  })
})
