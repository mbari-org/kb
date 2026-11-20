import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { use } from 'react'
import { alpha } from '@mui/material/styles'

import Concepts from '@/components/kb/panels/Concepts'
import ConceptPath from '@/components/kb/panels/concepts/concept/ConceptPath'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants/selected.js'
import theme from '@/lib/theme'

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

    const Path = () => {
      const context = use(ConceptContext)
      return (
        <SelectedContext.Provider value={{ updateSelected }}>
          <ConceptContext.Provider value={{ ...context, conceptPath: ['root', 'object', 'dingo'] }}>
            <ConceptPath />
          </ConceptContext.Provider>
        </SelectedContext.Provider>
      )
    }

    render(<ConceptPanelTestWrapper><Path /></ConceptPanelTestWrapper>)

    const hoverStyles = element => Array.from(document.styleSheets).flatMap(sheet =>
      Array.from(sheet.cssRules)
        .filter(rule => rule.selectorText?.endsWith(':hover') && element.matches(rule.selectorText.replace(':hover', '')))
        .map(rule => rule.style)
    )
    const ancestor = screen.getByRole('button', { name: 'object' })
    const current = screen.getByRole('button', { name: 'dingo' })
    const ancestorHover = hoverStyles(ancestor).find(style => style.fontStyle === 'italic')
    expect(ancestorHover.backgroundColor).toBe(alpha(theme.palette.primary.main, 0.3))
    expect(hoverStyles(current).some(style => style.fontStyle === 'italic')).toBe(false)
    expect(hoverStyles(current).at(-1).backgroundColor).toBe('transparent')

    await user.click(ancestor)

    await waitFor(() => {
      expect(updateSelected).toHaveBeenCalledWith({
        [SELECTED.CONCEPT]: 'object',
        [SELECTED.PANEL]: SELECTED.PANELS.CONCEPTS,
      })
    })
  })
})
