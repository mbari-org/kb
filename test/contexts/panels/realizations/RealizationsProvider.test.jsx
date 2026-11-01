import { use } from 'react'
import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import RealizationsProvider from '@/contexts/panels/realizations/RealizationsProvider'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'

import { SELECTED } from '@/lib/constants/selected.js'

const conceptCRealizations = [
  { id: 'r-c', concept: 'C', linkName: 'eats', toConcept: 'D', linkValue: 'daily', lastUpdated: null },
]
const conceptDRealizations = [
  { id: 'r-d', concept: 'D', linkName: 'lives-in', toConcept: 'E', linkValue: 'deep', lastUpdated: null },
]
const allRealizations = [{ id: 'r-all', concept: 'A', linkName: 'sees', toConcept: 'B', linkValue: 'always', lastUpdated: null }]

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
  const ensureAllRealizations = vi.fn()
  const ensureConceptRealizations = vi.fn()
  let settings = buildSettings(undefined)
  let realizationsByConcept = {}
  let realizationsAllLoaded = false

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
          <PanelDataContext
            value={{
              ensureAllRealizations: ensureAllRealizations.mockImplementation(async () =>
                Object.values(realizationsByConcept).flat()
              ),
              ensureConceptRealizations: ensureConceptRealizations.mockImplementation(
                async conceptName => realizationsByConcept[conceptName] ?? []
              ),
              getAllRealizations: () => Object.values(realizationsByConcept).flat(),
              getConceptRealizations: conceptName => realizationsByConcept[conceptName],
              pendingHistory: [],
              realizationsAllLoaded,
              realizationsByConcept,
            }}
          >
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
    ensureAllRealizations,
    ensureConceptRealizations,
    updateSettings,
    setFilter: async conceptFilter => {
      settings = buildSettings(conceptFilter)
      await act(async () => {
        view.rerender(tree())
      })
    },
    setMap: async (nextMap, { allLoaded = false } = {}) => {
      realizationsByConcept = nextMap
      realizationsAllLoaded = allLoaded
      await act(async () => {
        view.rerender(tree())
      })
    },
  }
}

describe('RealizationsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ensures only the filtered concept realizations when the panel is displayed', async () => {
    const { ensureAllRealizations, ensureConceptRealizations, updateSettings, setFilter, setMap } = setup()

    expect(updateSettings).toHaveBeenCalledWith({ realizations: { filters: { concept: 'C' } } })

    await setFilter('C')
    await setMap({ C: conceptCRealizations })

    expect(ensureConceptRealizations).toHaveBeenCalledWith('C')
    expect(ensureAllRealizations).not.toHaveBeenCalled()
    expect(screen.getByTestId('filtered').textContent).toBe('r-c')
  })

  it('ensures realizations again each time a different concept is filtered', async () => {
    const { ensureConceptRealizations, setFilter, setMap } = setup()

    await setFilter('C')
    await setMap({ C: conceptCRealizations })
    await setFilter('D')
    await setMap({ C: conceptCRealizations, D: conceptDRealizations })

    expect(ensureConceptRealizations).toHaveBeenCalledWith('C')
    expect(ensureConceptRealizations).toHaveBeenCalledWith('D')
    expect(screen.getByTestId('filtered').textContent).toBe('r-d')
  })

  it('ensures all realizations when the concept filter is cleared', async () => {
    const { ensureAllRealizations, setFilter, setMap } = setup()

    await setFilter('C')
    await setMap({ C: conceptCRealizations })
    await setFilter('')
    await setMap({ A: allRealizations, C: conceptCRealizations }, { allLoaded: true })

    expect(ensureAllRealizations).toHaveBeenCalled()
    expect(screen.getByTestId('filtered').textContent).toBe('r-all,r-c')
  })

  it('shows the loaded catalog from the shared map without per-concept ensures', async () => {
    const { ensureConceptRealizations, setFilter, setMap } = setup()

    await setMap({ A: allRealizations }, { allLoaded: true })
    await setFilter('')

    expect(ensureConceptRealizations).not.toHaveBeenCalled()
    expect(screen.getByTestId('filtered').textContent).toBe('r-all')
  })

  it('reflects shared map updates for the filtered concept', async () => {
    const { setFilter, setMap } = setup()

    await setFilter('C')
    await setMap({ C: conceptCRealizations })
    expect(screen.getByTestId('filtered').textContent).toBe('r-c')

    await setMap({
      C: [{ id: 'r-c2', concept: 'C', linkName: 'eats', toConcept: 'D', linkValue: 'weekly', lastUpdated: null }],
    })
    expect(screen.getByTestId('filtered').textContent).toBe('r-c2')
  })
})
