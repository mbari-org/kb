import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const taxonomyNames = ['root', 'dingo', 'object']

const renderConceptSelect = ({
  conceptName = '',
  doConceptSelected = vi.fn(() => true),
  onClear = vi.fn(),
  ignoreClearSelection = false,
  updateConceptSelected = true,
} = {}) => {
  const updateSelected = vi.fn()

  render(
    <TaxonomyContext.Provider value={{ getNames: () => taxonomyNames }}>
      <SelectedContext.Provider value={{ updateSelected }}>
        <ConceptSelect
          conceptName={conceptName}
          doConceptSelected={doConceptSelected}
          ignoreClearSelection={ignoreClearSelection}
          onClear={onClear}
          updateConceptSelected={updateConceptSelected}
        />
      </SelectedContext.Provider>
    </TaxonomyContext.Provider>
  )

  return { doConceptSelected, onClear, updateSelected }
}

describe('ConceptSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('selects a concept option and updates selected concept by default', async () => {
    const user = userEvent.setup()
    const { doConceptSelected, updateSelected } = renderConceptSelect()

    const input = screen.getByRole('combobox')
    await user.click(input)

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'dingo' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('option', { name: 'dingo' }))

    expect(doConceptSelected).toHaveBeenCalledWith('dingo')
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'dingo' })
  })

  it('does not update selected context when updateConceptSelected is false', async () => {
    const user = userEvent.setup()
    const { doConceptSelected, updateSelected } = renderConceptSelect({
      updateConceptSelected: false,
    })

    const input = screen.getByRole('combobox')
    await user.click(input)

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'object' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('option', { name: 'object' }))

    expect(doConceptSelected).toHaveBeenCalledWith('object')
    expect(updateSelected).not.toHaveBeenCalled()
  })

  it('invokes onClear unless clear selection is ignored', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()

    const firstRender = renderConceptSelect({
      conceptName: 'dingo',
      onClear,
      ignoreClearSelection: false,
    })

    const clearButton = screen.getByLabelText(/clear/i)
    await user.click(clearButton)
    expect(firstRender.onClear).toHaveBeenCalledTimes(1)

    const secondOnClear = vi.fn()
    const { unmount } = render(
      <TaxonomyContext.Provider value={{ getNames: () => taxonomyNames }}>
        <SelectedContext.Provider value={{ updateSelected: vi.fn() }}>
          <ConceptSelect
            conceptName='dingo'
            doConceptSelected={vi.fn()}
            ignoreClearSelection={true}
            onClear={secondOnClear}
          />
        </SelectedContext.Provider>
      </TaxonomyContext.Provider>
    )

    await user.click(screen.getAllByLabelText(/clear/i)[1])
    expect(secondOnClear).not.toHaveBeenCalled()
    unmount()
  })
})
