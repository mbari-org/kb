import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HistoryHeaderLeft from '@/components/kb/panels/history/header/HistoryHeaderLeft'
import HistoryContext from '@/contexts/panels/history/HistoryContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
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
  selectedType = SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT,
  selectedConcept = 'dingo',
} = {}) => {
  const updateSelected = vi.fn()
  const getSelected = key => (key === SELECTED.CONCEPT ? selectedConcept : null)

  const result = render(
    <HistoryContext.Provider value={{ selectedType }}>
      <SelectedContext.Provider value={{ concepts: conceptHistory, getSelected, updateSelected }}>
        <HistoryHeaderLeft />
      </SelectedContext.Provider>
    </HistoryContext.Provider>
  )

  return { ...result, updateSelected }
}

describe('HistoryHeaderLeft', () => {
  beforeEach(() => {
    capturedConceptSelectProps = null
    vi.clearAllMocks()
  })

  it('does not render ConceptSelect when selected history type is not concept', () => {
    renderHeader({ selectedType: SELECTED.SETTINGS.HISTORY.TYPES.PENDING })

    expect(capturedConceptSelectProps).toBeNull()
  })

  it('does not render ConceptSelect when selected history type is approved', () => {
    renderHeader({ selectedType: SELECTED.SETTINGS.HISTORY.TYPES.APPROVED })

    expect(capturedConceptSelectProps).toBeNull()
  })

  it('configures ConceptSelect to keep clear disabled and skip automatic context updates', () => {
    renderHeader({ selectedType: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT })

    expect(capturedConceptSelectProps).toBeDefined()
    expect(capturedConceptSelectProps.ignoreClearSelection).toBe(true)
    expect(capturedConceptSelectProps.updateConceptSelected).toBe(false)
    expect(capturedConceptSelectProps.conceptName).toBe('dingo')
    expect(capturedConceptSelectProps.inputValue).toBe('dingo')
  })

  it('updates selected concept only when ConceptSelect callback receives a non-empty value', () => {
    const { updateSelected } = renderHeader({
      selectedType: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT,
      selectedConcept: 'dingo',
    })

    act(() => {
      capturedConceptSelectProps.doConceptSelected('object')
    })
    expect(updateSelected).toHaveBeenCalledWith({ [SELECTED.CONCEPT]: 'object' })

    act(() => {
      capturedConceptSelectProps.doConceptSelected(null)
    })
    expect(updateSelected).toHaveBeenCalledTimes(1)
  })

  it('switches ConceptSelect inputValue to draft while typing and restores selected concept on blur', () => {
    renderHeader({
      selectedType: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT,
      selectedConcept: 'dingo',
    })

    act(() => {
      capturedConceptSelectProps.onInputChange(null, 'din')
    })
    expect(capturedConceptSelectProps.inputValue).toBe('din')

    act(() => {
      capturedConceptSelectProps.onInputBlur()
    })
    expect(capturedConceptSelectProps.inputValue).toBe('dingo')
  })
})
