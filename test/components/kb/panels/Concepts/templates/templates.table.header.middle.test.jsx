import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import TemplatesTableHeaderMiddle from '@/components/kb/panels/templates/table/header/TemplatesTableHeaderMiddle'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { EMPTY_FILTERS } from '@/lib/concept/state/templates'
import { SELECTED } from '@/lib/constants/selected'
import CONFIG from '@/text'

const { TEMPLATES } = SELECTED.SETTINGS
const { BUTTON } = CONFIG.PANELS.TEMPLATES

const renderHeaderMiddle = filters => {
  const updateFilters = vi.fn()

  render(
    <TemplatesContext value={{ filters, updateFilters }}>
      <TemplatesTableHeaderMiddle />
    </TemplatesContext>
  )

  return { updateFilters }
}

describe('TemplatesTableHeaderMiddle', () => {
  it('disables clear filters when all filters are empty', () => {
    renderHeaderMiddle({ ...EMPTY_FILTERS })

    const clearButton = screen.getByRole('button', { name: BUTTON.CLEAR_FILTERS })
    expect(clearButton).toBeDisabled()
  })

  it('enables clear filters when any filter has a value', () => {
    renderHeaderMiddle({
      ...EMPTY_FILTERS,
      [TEMPLATES.FILTERS.LINK_NAME]: 'contains',
    })

    const clearButton = screen.getByRole('button', { name: BUTTON.CLEAR_FILTERS })
    expect(clearButton).toBeEnabled()
  })
})
