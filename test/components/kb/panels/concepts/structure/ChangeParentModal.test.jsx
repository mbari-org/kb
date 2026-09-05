import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'

import kbTheme from '@/lib/theme'
import ChangeParentContent from '@/components/kb/panels/concepts/concept/change/staged/parent/ChangeParentContent'
import ChangeParentActions from '@/components/kb/panels/concepts/concept/change/staged/parent/ChangeParentActions'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const TestChangeParent = ({
  concept = { name: 'childConcept', parent: 'root' },
  taxonomyNames = ['root', 'childConcept', 'validParent', 'otherParent'],
  omitChoices = ['childConcept', 'root'],
  onStage = vi.fn(),
}) => {
  const [modalData, setModalData] = useState({
    action: 'Parent',
    isValid: false,
    modified: false,
    parent: '',
  })

  return (
    <ThemeProvider theme={kbTheme}>
      <TaxonomyContext.Provider value={{ getNames: () => taxonomyNames }}>
        <ConceptContext.Provider
          value={{
            concept,
            confirmReset: false,
            modifyConcept: onStage,
            pending: () => [],
          }}
        >
          <ConceptModalContext.Provider
            value={{
              closeModal: vi.fn(),
              modalData,
              setModalData,
            }}
          >
            <ChangeParentContent omitChoices={omitChoices} />
            <ChangeParentActions />
          </ConceptModalContext.Provider>
        </ConceptContext.Provider>
      </TaxonomyContext.Provider>
    </ThemeProvider>
  )
}

describe('ChangeParent modal validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('disables Stage button initially and when typing an invalid concept name', async () => {
    const user = userEvent.setup()
    render(<TestChangeParent />)

    const stageButton = screen.getByRole('button', { name: 'Stage' })
    expect(stageButton).toBeDisabled()

    const input = screen.getByRole('combobox')
    await user.type(input, 'invalidConceptName')

    expect(stageButton).toBeDisabled()
  })

  it('disables Stage button when typing an omitted choice such as current parent', async () => {
    const user = userEvent.setup()
    render(<TestChangeParent />)

    const stageButton = screen.getByRole('button', { name: 'Stage' })
    const input = screen.getByRole('combobox')

    await user.type(input, 'root')
    expect(stageButton).toBeDisabled()
  })

  it('enables Stage button when selecting or typing a valid parent concept', async () => {
    const user = userEvent.setup()
    render(<TestChangeParent />)

    const stageButton = screen.getByRole('button', { name: 'Stage' })
    const input = screen.getByRole('combobox')

    await user.click(input)
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'validParent' })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('option', { name: 'validParent' }))

    expect(stageButton).toBeEnabled()
  })

  it('disables Stage button again if valid parent is cleared or replaced with invalid text', async () => {
    const user = userEvent.setup()
    render(<TestChangeParent />)

    const stageButton = screen.getByRole('button', { name: 'Stage' })
    const input = screen.getByRole('combobox')

    await user.click(input)
    await user.click(screen.getByRole('option', { name: 'validParent' }))
    expect(stageButton).toBeEnabled()

    await user.type(input, 'XYZ')
    expect(stageButton).toBeDisabled()
  })
})
