import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import TemplatesHeaderLeft from '@/components/kb/panels/templates/header/TemplatesHeaderLeft'
import { SELECTED } from '@/lib/constants/selected'

let capturedConceptSelectProps

vi.mock('@/components/common/concept/ConceptSelect', () => ({
  default: props => {
    capturedConceptSelectProps = props
    return <div data-testid='concept-select' />
  },
}))

const renderHeader = ({
  selectedConcept = 'dingo',
  selectedPanel = SELECTED.PANELS.TEMPLATES,
  byAvailable = false,
  explicitConcepts = ['dingo'],
  filters = { [SELECTED.SETTINGS.TEMPLATES.FILTERS.CONCEPT]: '' },
} = {}) => {
  const updateSelected = vi.fn()
  const updateSettings = vi.fn()
  const updateFilters = vi.fn()
  const getNames = vi.fn(() => ['root', 'dingo', 'object'])

  const getSelected = key => {
    if (key === SELECTED.CONCEPT) {
      return selectedConcept
    } else if (key === SELECTED.PANEL) {
      return selectedPanel
    } else {
      return null
    }
  }

  render(
    <TaxonomyContext.Provider value={{ getNames }}>
      <SelectedContext.Provider value={{ getSelected, updateSelected, updateSettings }}>
        <TemplatesContext.Provider
          value={{
            byAvailable,
            explicitConcepts,
            filters,
            updateFilters,
          }}
        >
          <TemplatesHeaderLeft />
        </TemplatesContext.Provider>
      </SelectedContext.Provider>
    </TaxonomyContext.Provider>
  )

  return { getNames, updateFilters, updateSelected, updateSettings }
}

describe('TemplatesHeaderLeft', () => {
  beforeEach(() => {
    capturedConceptSelectProps = null
    vi.clearAllMocks()
  })

  it('uses explicit concepts when byAvailable is false', () => {
    renderHeader({
      byAvailable: false,
      explicitConcepts: ['dingo', 'object'],
    })

    expect(capturedConceptSelectProps).toBeDefined()
    expect(capturedConceptSelectProps.selectables).toEqual(['dingo', 'object'])
  })

  it('uses taxonomy names when byAvailable is true', () => {
    const { getNames } = renderHeader({
      byAvailable: true,
      explicitConcepts: ['dingo'],
    })

    expect(getNames).toHaveBeenCalled()
    expect(capturedConceptSelectProps.selectables).toEqual(['root', 'dingo', 'object'])
  })

  it('updates selected concept and template filters from ConceptSelect callback', () => {
    const { updateFilters, updateSelected } = renderHeader()

    act(() => {
      capturedConceptSelectProps.doConceptSelected('object')
    })

    expect(updateSelected).toHaveBeenCalledWith({ [SELECTED.CONCEPT]: 'object' })
    expect(updateFilters).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.TEMPLATES.FILTERS.CONCEPT]: 'object',
    })
  })

  it('clears template concept filter, selected concept, and turns off by-available mode on clear selection', () => {
    const { updateFilters, updateSelected, updateSettings } = renderHeader()

    act(() => {
      capturedConceptSelectProps.doConceptSelected(null)
    })

    expect(updateSelected).toHaveBeenCalledWith({ [SELECTED.CONCEPT]: null })
    expect(updateFilters).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.TEMPLATES.FILTERS.CONCEPT]: '',
    })
    expect(updateSettings).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.TEMPLATES.KEY]: { [SELECTED.SETTINGS.TEMPLATES.BY_AVAILABLE]: false },
    })
  })

  it('displays the template filter concept value, not the selected concept, in ConceptSelect', () => {
    renderHeader({
      selectedConcept: 'dingo',
      filters: { [SELECTED.SETTINGS.TEMPLATES.FILTERS.CONCEPT]: 'object' },
    })

    expect(capturedConceptSelectProps.conceptName).toBe('object')
  })
})
