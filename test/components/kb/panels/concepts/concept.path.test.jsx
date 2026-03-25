import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Concepts from '@/components/kb/panels/Concepts'
import ConceptPath from '@/components/kb/panels/concepts/concept/ConceptPath'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants/selected.js'

import { ConceptPanelTestWrapper } from './concept.panel.test.wrapper'

describe('Concept path behavior', () => {
  it('updates the path when a concept is selected from ConceptSelect', async () => {
    const user = userEvent.setup()

    render(
      <ConceptPanelTestWrapper>
        <Concepts />
      </ConceptPanelTestWrapper>
    )

    expect(screen.getByRole('button', { name: 'dingo' })).toBeInTheDocument()

    const conceptInput = screen.getByRole('combobox')
    await user.clear(conceptInput)
    await user.type(conceptInput, 'object{enter}')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'object' })).toBeInTheDocument()
    })
  })

  it('selects the expected concept when clicking the path', async () => {
    const user = userEvent.setup()
    const updateSelected = vi.fn()

    render(
      <SelectedContext.Provider value={{ updateSelected }}>
        <ConceptContext.Provider value={{ conceptPath: ['root', 'object', 'dingo'] }}>
          <ConceptPath />
        </ConceptContext.Provider>
      </SelectedContext.Provider>
    )

    await user.click(screen.getByRole('button', { name: 'object' }))

    expect(updateSelected).toHaveBeenCalledWith({
      [SELECTED.CONCEPT]: 'object',
      [SELECTED.PANEL]: SELECTED.PANELS.CONCEPTS,
    })
  })
})
