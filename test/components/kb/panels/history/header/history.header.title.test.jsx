import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HistoryHeaderTitle from '@/components/kb/panels/history/header/HistoryHeaderTitle'
import HistoryContext from '@/contexts/panels/history/HistoryContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import { CONCEPT, SELECTED } from '@/lib/constants'
import CONFIG from '@/text'

const renderTitle = ({
  selectedType = SELECTED.SETTINGS.HISTORY.TYPES.APPROVED,
  selectedConcept = 'dingo',
  extent = CONCEPT.EXTENT.SOLO,
} = {}) => {
  const getSelected = key => (key === SELECTED.CONCEPT ? selectedConcept : null)

  render(
    <HistoryContext.Provider
      value={{
        selectedType,
        conceptState: { extent },
      }}
    >
      <SelectedContext.Provider value={{ getSelected }}>
        <HistoryHeaderTitle />
      </SelectedContext.Provider>
    </HistoryContext.Provider>
  )
}

describe('HistoryHeaderTitle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows approved subtitle when approved history type is selected', () => {
    renderTitle({ selectedType: SELECTED.SETTINGS.HISTORY.TYPES.APPROVED })

    expect(screen.getByText(CONFIG.PANELS.HISTORY.PANEL.NAME)).toBeInTheDocument()
    expect(
      screen.getByText(CONFIG.PANELS.HISTORY.TYPE[SELECTED.SETTINGS.HISTORY.TYPES.APPROVED.toUpperCase()])
    ).toBeInTheDocument()
  })

  it('shows pending subtitle when pending history type is selected', () => {
    renderTitle({ selectedType: SELECTED.SETTINGS.HISTORY.TYPES.PENDING })

    expect(
      screen.getByText(CONFIG.PANELS.HISTORY.TYPE[SELECTED.SETTINGS.HISTORY.TYPES.PENDING.toUpperCase()])
    ).toBeInTheDocument()
  })
})
