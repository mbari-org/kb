import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'

import kbTheme from '@/lib/theme'
import ToConceptChoice from '@/components/kb/panels/concepts/concept/change/staged/structure/ToConceptChoice'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

describe('ToConceptChoice', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ranks options as exact match, then prefix, then contains', async () => {
    const user = userEvent.setup()
    const taxonomyNames = ['Amedusa', 'medu', 'Medusa', 'xmedu', 'object', 'currentConcept']

    render(
      <ThemeProvider theme={kbTheme}>
        <TaxonomyContext.Provider value={{ getNames: () => taxonomyNames }}>
          <ToConceptChoice
            error={false}
            handleChange={vi.fn()}
            handleKeyUp={vi.fn()}
            label='Reassign To'
            omitChoices={['currentConcept']}
            required
            value=''
          />
        </TaxonomyContext.Provider>
      </ThemeProvider>
    )

    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.type(input, 'medu')

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'medu' })).toBeInTheDocument()
    })

    const optionNames = screen.getAllByRole('option').map(option => option.textContent)
    expect(optionNames).toEqual(['medu', 'Medusa', 'Amedusa', 'xmedu'])
  })
})
