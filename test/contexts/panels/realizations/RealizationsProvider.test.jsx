import { use } from 'react'
import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import RealizationsProvider from '@/contexts/panels/realizations/RealizationsProvider'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'

import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { SELECTED } from '@/lib/constants/selected.js'

const { loadRealizationsMock } = vi.hoisted(() => ({
  loadRealizationsMock: vi.fn(),
}))

vi.mock('@/contexts/panel/data/useLoadRealizations', () => ({
  default: () => loadRealizationsMock,
}))

const conceptCRealizations = [
  { id: 'r-c', concept: 'C', linkName: 'eats', toConcept: 'D', linkValue: 'daily', lastUpdated: null },
]
const conceptDRealizations = [
  { id: 'r-d', concept: 'D', linkName: 'lives-in', toConcept: 'E', linkValue: 'deep', lastUpdated: null },
]
const storeRealizations = [
  { id: 'r-all', concept: 'A', linkName: 'sees', toConcept: 'B', linkValue: 'always', lastUpdated: null },
]

const buildSettings = conceptFilter => ({
  filters: {
    concept: conceptFilter,
    toConcept: '',
    linkName: '',
    linkValue: '',
  },
})

const FilteredIds = () => {
  const { filteredRealizations } = use(RealizationsContext)
  return <div data-testid='filtered'>{filteredRealizations.map(realization => realization.id).join(',')}</div>
}

const setup = ({ selectedConcept = 'C' } = {}) => {
  const updateSettings = vi.fn()
  const refreshData = vi.fn()
  let settings = buildSettings(undefined)
  let store = []

  const tree = () => (
    <ConfigContext value={{ apiFns: {} }}>
      <SelectedContext
        value={{
          getSelected: key =>
            ({
              [SELECTED.PANEL]: SELECTED.PANELS.REALIZATIONS,
              [SELECTED.CONCEPT]: selectedConcept,
            })[key],
        }}
      >
        <SelectedSettingsContext value={{ getSettings: () => settings, updateSettings }}>
          <PanelDataContext value={{ realizations: store, refreshData }}>
            <RealizationsProvider>
              <FilteredIds />
            </RealizationsProvider>
          </PanelDataContext>
        </SelectedSettingsContext>
      </SelectedContext>
    </ConfigContext>
  )

  const view = render(tree())

  return {
    refreshData,
    updateSettings,
    setFilter: async conceptFilter => {
      settings = buildSettings(conceptFilter)
      await act(async () => {
        view.rerender(tree())
      })
    },
    setStore: async realizations => {
      store = realizations
      await act(async () => {
        view.rerender(tree())
      })
    },
  }
}

describe('RealizationsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    loadRealizationsMock.mockImplementation(async conceptName =>
      conceptName === 'C' ? conceptCRealizations : conceptDRealizations
    )
  })

  it('loads only the current concept realizations when the panel is displayed', async () => {
    const { refreshData, updateSettings, setFilter } = setup()

    expect(updateSettings).toHaveBeenCalledWith({ realizations: { filters: { concept: 'C' } } })
    expect(loadRealizationsMock).not.toHaveBeenCalled()

    await setFilter('C')

    expect(loadRealizationsMock).toHaveBeenCalledTimes(1)
    expect(loadRealizationsMock).toHaveBeenCalledWith('C')
    expect(refreshData).not.toHaveBeenCalled()
    expect(screen.getByTestId('filtered').textContent).toBe('r-c')
  })

  it('loads realizations again each time a different concept is selected', async () => {
    const { setFilter } = setup()

    await setFilter('C')
    await setFilter('D')

    expect(loadRealizationsMock).toHaveBeenCalledTimes(2)
    expect(loadRealizationsMock).toHaveBeenNthCalledWith(1, 'C')
    expect(loadRealizationsMock).toHaveBeenNthCalledWith(2, 'D')
    expect(screen.getByTestId('filtered').textContent).toBe('r-d')
  })

  it('loads all realizations when the concept selection is cleared', async () => {
    const { refreshData, setFilter } = setup()

    await setFilter('C')
    await setFilter('')

    expect(refreshData).toHaveBeenCalledWith(PANEL_DATA.REALIZATIONS)
    expect(loadRealizationsMock).toHaveBeenCalledTimes(1)
  })

  it('does not reload all realizations on clear when the store is already populated', async () => {
    const { refreshData, setFilter, setStore } = setup()

    await setStore(storeRealizations)
    await setFilter('')

    expect(refreshData).not.toHaveBeenCalled()
    expect(loadRealizationsMock).not.toHaveBeenCalled()
    expect(screen.getByTestId('filtered').textContent).toBe('r-all')
  })

  it('reloads the concept realizations when the shared store is refreshed', async () => {
    const { setFilter, setStore } = setup()

    await setFilter('C')
    await setStore(storeRealizations)

    expect(loadRealizationsMock).toHaveBeenCalledTimes(2)
    expect(loadRealizationsMock).toHaveBeenNthCalledWith(2, 'C')
    expect(screen.getByTestId('filtered').textContent).toBe('r-c')
  })
})
