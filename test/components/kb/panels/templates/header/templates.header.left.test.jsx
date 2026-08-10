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

  it('updates selected concept and template filters from ConceptSelect callback and turns off by-available', () => {
    const { updateFilters, updateSelected, updateSettings } = renderHeader()

    act(() => {
      capturedConceptSelectProps.doConceptSelected('object')
    })

    expect(updateSelected).toHaveBeenCalledWith({ [SELECTED.CONCEPT]: 'object' })
    expect(updateFilters).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.TEMPLATES.FILTERS.CONCEPT]: 'object',
    })
    expect(updateSettings).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.TEMPLATES.KEY]: { [SELECTED.SETTINGS.TEMPLATES.BY_AVAILABLE]: false },
    })
  })

  it('clears template concept filter and turns on by-available mode without affecting selected concept', () => {
    const { updateFilters, updateSelected, updateSettings } = renderHeader()

    act(() => {
      capturedConceptSelectProps.onClear()
    })

    expect(updateSelected).not.toHaveBeenCalled()
    expect(updateFilters).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.TEMPLATES.FILTERS.CONCEPT]: '',
    })
    expect(updateSettings).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.TEMPLATES.KEY]: { [SELECTED.SETTINGS.TEMPLATES.BY_AVAILABLE]: true },
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
