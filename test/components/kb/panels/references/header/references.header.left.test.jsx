import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import SelectedContext from '@/contexts/selected/SelectedContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import ReferencesHeaderLeft from '@/components/kb/panels/references/header/ReferencesHeaderLeft'
import { SELECTED } from '@/lib/constants/selected'

let capturedConceptSelectProps

vi.mock('@/components/common/concept/ConceptSelect', () => ({
  default: props => {
    capturedConceptSelectProps = props
    return <div data-testid='concept-select' />
  },
}))

const conceptHistory = {
  canGoBack: () => false,
  canGoForward: () => false,
  backItems: () => [],
  forwardItems: () => [],
  back: () => {},
  forward: () => {},
  goBack: () => {},
  goForward: () => {},
}

const renderHeader = ({
  selectedConcept = 'dingo',
  filters = { [SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPT]: 'dingo' },
} = {}) => {
  const updateSelected = vi.fn()
  const updateFilters = vi.fn()

  const getSelected = key => {
    if (key === SELECTED.CONCEPT) {
      return selectedConcept
    } else if (key === SELECTED.PANEL) {
      return SELECTED.PANELS.REFERENCES
    } else {
      return null
    }
  }

  render(
    <SelectedContext.Provider
      value={{
        concepts: conceptHistory,
        getSelected,
        updateSelected,
      }}
    >
      <ReferencesContext.Provider value={{ filters, updateFilters }}>
        <ReferencesHeaderLeft />
      </ReferencesContext.Provider>
    </SelectedContext.Provider>
  )

  return { updateFilters, updateSelected }
}

describe('ReferencesHeaderLeft', () => {
  beforeEach(() => {
    capturedConceptSelectProps = null
    vi.clearAllMocks()
  })

  it('passes references concept filter value to ConceptSelect', () => {
    renderHeader({
      selectedConcept: 'dingo',
      filters: { [SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPT]: 'object' },
    })

    expect(capturedConceptSelectProps).toBeDefined()
    expect(capturedConceptSelectProps.conceptName).toBe('object')
  })

  it('updates global selected concept and references filter from ConceptSelect selection', () => {
    const { updateFilters, updateSelected } = renderHeader()

    act(() => {
      capturedConceptSelectProps.doConceptSelected('object')
    })

    expect(updateSelected).toHaveBeenCalledWith({ [SELECTED.CONCEPT]: 'object' })
    expect(updateFilters).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPT]: 'object',
    })
  })

  it('clears references filter without affecting selected concept', () => {
    const { updateFilters, updateSelected } = renderHeader()

    act(() => {
      capturedConceptSelectProps.onClear()
    })

    expect(updateSelected).not.toHaveBeenCalled()
    expect(updateFilters).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPT]: '',
    })
  })
})
