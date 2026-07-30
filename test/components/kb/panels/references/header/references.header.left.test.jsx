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
  byConcept = true,
  filters = { [SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPT]: 'dingo' },
} = {}) => {
  const updateSettings = vi.fn()
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

  const getSettings = (key, subKey) => {
    if (key === SELECTED.SETTINGS.REFERENCES.KEY && subKey === SELECTED.SETTINGS.REFERENCES.BY_CONCEPT) {
      return byConcept
    }
    return undefined
  }

  render(
    <SelectedContext.Provider
      value={{
        concepts: conceptHistory,
        getSelected,
        getSettings,
        updateSettings,
      }}
    >
      <ReferencesContext.Provider value={{ filters, updateFilters }}>
        <ReferencesHeaderLeft />
      </ReferencesContext.Provider>
    </SelectedContext.Provider>
  )

  return { updateFilters, updateSettings }
}

describe('ReferencesHeaderLeft', () => {
  beforeEach(() => {
    capturedConceptSelectProps = null
    vi.clearAllMocks()
  })

  it('passes references concept filter value to ConceptSelect when by-concept mode is enabled', () => {
    renderHeader({
      selectedConcept: 'dingo',
      byConcept: true,
      filters: { [SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPT]: 'object' },
    })

    expect(capturedConceptSelectProps).toBeDefined()
    expect(capturedConceptSelectProps.conceptName).toBe('object')
  })

  it('uses empty ConceptSelect value when by-concept mode is disabled', () => {
    renderHeader({ selectedConcept: 'dingo', byConcept: false })

    expect(capturedConceptSelectProps).toBeDefined()
    expect(capturedConceptSelectProps.conceptName).toBe('')
  })

  it('updates references filters and references settings through ConceptSelect callbacks', () => {
    const { updateFilters, updateSettings } = renderHeader({
      selectedConcept: 'dingo',
      byConcept: true,
    })

    act(() => {
      capturedConceptSelectProps.doConceptSelected('object')
    })

    expect(updateFilters).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPT]: 'object',
    })
    expect(updateSettings).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.REFERENCES.KEY]: { [SELECTED.SETTINGS.REFERENCES.BY_CONCEPT]: true },
    })

    act(() => {
      capturedConceptSelectProps.onClear()
    })

    expect(updateFilters).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPT]: '',
    })
    expect(updateSettings).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.REFERENCES.KEY]: { [SELECTED.SETTINGS.REFERENCES.BY_CONCEPT]: false },
    })
  })
})
