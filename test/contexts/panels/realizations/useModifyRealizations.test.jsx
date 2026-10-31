import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useModifyRealizations from '@/contexts/panels/realizations/useModifyRealizations'

import { getConcept as apiGetConcept } from '@/lib/api/concept'
import { deleteRealization as apiDeleteRealization, updateRealization } from '@/lib/api/realizations'

const normalizeConceptMock = vi.fn()

vi.mock('@/lib/api/concept', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    normalizeConcept: (...args) => normalizeConceptMock(...args),
  }
})

const ORIGINAL = { id: 7, concept: 'dingo', linkName: 'eats', toConcept: 'fish', linkValue: 'daily' }

const buildHarness = ({ taxonomyConcept }) => {
  const freshConcept = { name: 'dingo', media: [], realizations: [] }
  const apiFns = {
    apiPayload: vi.fn(async fn => {
      if (fn === apiGetConcept) {
        return freshConcept
      }
      return {}
    }),
  }
  const refreshData = vi.fn(async () => ({}))
  const conceptEditsRefresh = vi.fn(async () => ({ concept: freshConcept }))
  const getConcept = vi.fn(() => taxonomyConcept)
  normalizeConceptMock.mockImplementation(async (_apiFns, concept) => concept)

  const wrapper = ({ children }) => (
    <ConfigContext.Provider value={{ apiFns }}>
      <PanelDataContext.Provider value={{ refreshData }}>
        <TaxonomyContext.Provider value={{ conceptEditsRefresh, getConcept }}>
          {children}
        </TaxonomyContext.Provider>
      </PanelDataContext.Provider>
    </ConfigContext.Provider>
  )

  return { apiFns, conceptEditsRefresh, freshConcept, refreshData, wrapper }
}

describe('useModifyRealizations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('editRealization updates the server, reloads the panel cache, and refreshes the taxonomy concept', async () => {
    const staleConcept = { name: 'dingo' }
    const { apiFns, conceptEditsRefresh, freshConcept, refreshData, wrapper } = buildHarness({
      taxonomyConcept: staleConcept,
    })
    const updated = { linkValue: 'weekly' }

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await act(async () => {
      await result.current.editRealization(ORIGINAL, updated)
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(updateRealization, [ORIGINAL.id, updated])
    expect(refreshData).toHaveBeenCalledWith('realizations')
    expect(apiFns.apiPayload).toHaveBeenCalledWith(apiGetConcept, 'dingo')
    expect(normalizeConceptMock).toHaveBeenCalledWith(apiFns, freshConcept)
    expect(conceptEditsRefresh).toHaveBeenCalledWith(freshConcept, staleConcept)
  })

  it('editRealization skips the taxonomy refresh when the concept is not loaded in the taxonomy', async () => {
    const { apiFns, conceptEditsRefresh, refreshData, wrapper } = buildHarness({ taxonomyConcept: null })

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await act(async () => {
      await result.current.editRealization(ORIGINAL, { linkValue: 'weekly' })
    })

    expect(refreshData).toHaveBeenCalledWith('realizations')
    expect(apiFns.apiPayload).not.toHaveBeenCalledWith(apiGetConcept, expect.anything())
    expect(conceptEditsRefresh).not.toHaveBeenCalled()
  })

  it('deleteRealization removes the server realization, reloads the panel cache, and refreshes the taxonomy concept', async () => {
    const staleConcept = { name: 'dingo' }
    const { apiFns, conceptEditsRefresh, freshConcept, refreshData, wrapper } = buildHarness({
      taxonomyConcept: staleConcept,
    })

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await act(async () => {
      await result.current.deleteRealization(ORIGINAL)
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(apiDeleteRealization, ORIGINAL.id)
    expect(refreshData).toHaveBeenCalledWith('realizations')
    expect(apiFns.apiPayload).toHaveBeenCalledWith(apiGetConcept, 'dingo')
    expect(conceptEditsRefresh).toHaveBeenCalledWith(freshConcept, staleConcept)
  })
})
