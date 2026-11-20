import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Concepts from '@/components/kb/panels/Concepts'
import CONFIG from '@/lib/config'
import { ConceptPanelTestWrapper } from '../concept.panel.test.wrapper'

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
})
