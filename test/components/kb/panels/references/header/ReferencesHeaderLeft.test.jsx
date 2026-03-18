import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import SelectedContext from '@/contexts/selected/SelectedContext'
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

const renderHeader = ({ selectedConcept = 'dingo', byConcept = true } = {}) => {
  const updateSelected = vi.fn()
  const updateSettings = vi.fn()

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
        updateSelected,
        updateSettings,
      }}
    >
      <ReferencesHeaderLeft />
    </SelectedContext.Provider>
  )

  return { updateSelected, updateSettings }
}

describe('ReferencesHeaderLeft', () => {
  beforeEach(() => {
    capturedConceptSelectProps = null
    vi.clearAllMocks()
  })

  it('passes selected concept to ConceptSelect when by-concept mode is enabled', () => {
    renderHeader({ selectedConcept: 'dingo', byConcept: true })

    expect(capturedConceptSelectProps).toBeDefined()
    expect(capturedConceptSelectProps.conceptName).toBe('dingo')
  })

  it('uses empty ConceptSelect value when by-concept mode is disabled', () => {
    renderHeader({ selectedConcept: 'dingo', byConcept: false })

    expect(capturedConceptSelectProps).toBeDefined()
    expect(capturedConceptSelectProps.conceptName).toBe('')
  })

  it('updates selected concept and references settings through ConceptSelect callbacks', () => {
    const { updateSelected, updateSettings } = renderHeader({
      selectedConcept: 'dingo',
      byConcept: true,
    })

    act(() => {
      capturedConceptSelectProps.doConceptSelected('object')
    })

    expect(updateSelected).toHaveBeenCalledWith({ [SELECTED.CONCEPT]: 'object' })
    expect(updateSettings).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.REFERENCES.KEY]: { [SELECTED.SETTINGS.REFERENCES.BY_CONCEPT]: true },
    })

    act(() => {
      capturedConceptSelectProps.onClear()
    })

    expect(updateSettings).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.REFERENCES.KEY]: { [SELECTED.SETTINGS.REFERENCES.BY_CONCEPT]: false },
    })
  })
})
