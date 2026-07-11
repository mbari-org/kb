import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HistoryTableHeaderConceptRight from '@/components/kb/panels/history/table/header/HistoryTableHeaderConceptRight'
import HistoryContext from '@/contexts/panels/history/HistoryContext'
import { CONCEPT } from '@/lib/constants'

let capturedConceptExtentProps

vi.mock('@/components/common/concept/ConceptExtent', () => ({
  default: props => {
    capturedConceptExtentProps = props
    return <div data-testid='concept-extent' />
  },
}))

const renderHeader = ({ extent = CONCEPT.EXTENT.SOLO } = {}) => {
  const updateConceptState = vi.fn()

  render(
    <HistoryContext.Provider
      value={{
        conceptState: { extent },
        updateConceptState,
      }}
    >
      <HistoryTableHeaderConceptRight />
    </HistoryContext.Provider>
  )

  return { updateConceptState }
}

describe('HistoryTableHeaderConceptRight', () => {
  beforeEach(() => {
    capturedConceptExtentProps = null
    vi.clearAllMocks()
  })

  it('passes current concept extent to ConceptExtent', () => {
    renderHeader({ extent: CONCEPT.EXTENT.CHILDREN })

    expect(capturedConceptExtentProps).toBeDefined()
    expect(capturedConceptExtentProps.initialValue).toBe(CONCEPT.EXTENT.CHILDREN)
  })

  it('updates history concept extent when ConceptExtent selection changes', () => {
    const { updateConceptState } = renderHeader({ extent: CONCEPT.EXTENT.SOLO })

    act(() => {
      capturedConceptExtentProps.onChange(CONCEPT.EXTENT.DESCENDANTS)
    })

    expect(updateConceptState).toHaveBeenCalledWith({ extent: CONCEPT.EXTENT.DESCENDANTS })
  })
})
