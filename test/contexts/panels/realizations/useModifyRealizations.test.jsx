import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import useModifyRealizations from '@/contexts/panels/realizations/useModifyRealizations'

import { deleteRealization as apiDeleteRealization, updateRealization } from '@/lib/api/realizations'

const ORIGINAL = { id: 7, concept: 'dingo', linkName: 'eats', toConcept: 'fish', linkValue: 'daily' }
const OTHER = { id: 9, concept: 'dingo', linkName: 'lives-near', toConcept: 'reef', linkValue: 'often' }

const buildStaleConcept = () => ({
  name: 'dingo',
  aliases: [{ name: 'wild-dog', nameType: 'Common' }],
  alternateNames: ['wild-dog'],
  children: ['pup'],
  parent: 'canid',
  media: [],
  realizations: [{ ...ORIGINAL }, { ...OTHER }],
})

const buildHarness = ({ isAdmin = true, taxonomyConcept }) => {
  const apiFns = { apiPayload: vi.fn(async () => ({})) }
  const refreshData = vi.fn(async () => ({}))
  const conceptEditsRefresh = vi.fn(async freshConcept => ({ concept: freshConcept }))
  const getConcept = vi.fn(() => taxonomyConcept)

  const wrapper = ({ children }) => (
    <UserContext.Provider value={{ isAdmin }}>
      <ConfigContext.Provider value={{ apiFns }}>
        <PanelDataContext.Provider value={{ refreshData }}>
          <TaxonomyContext.Provider value={{ conceptEditsRefresh, getConcept }}>
            {children}
          </TaxonomyContext.Provider>
        </PanelDataContext.Provider>
      </ConfigContext.Provider>
    </UserContext.Provider>
  )

  return { apiFns, conceptEditsRefresh, refreshData, wrapper }
}

describe('useModifyRealizations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('editRealization updates the server, reloads panel data, and applies the update to the taxonomy concept in-situ', async () => {
    const staleConcept = buildStaleConcept()
    const { apiFns, conceptEditsRefresh, refreshData, wrapper } = buildHarness({
      taxonomyConcept: staleConcept,
    })
    const updated = { linkValue: 'weekly' }

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await act(async () => {
      await result.current.editRealization(ORIGINAL, updated)
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(updateRealization, [ORIGINAL.id, updated])
    expect(refreshData).toHaveBeenCalledWith('realizations')
    expect(refreshData).toHaveBeenCalledWith('pendingHistory')

    expect(conceptEditsRefresh).toHaveBeenCalledTimes(1)
    const [freshConcept, passedStale] = conceptEditsRefresh.mock.calls[0]
    expect(passedStale).toBe(staleConcept)
    expect(freshConcept.realizations).toEqual([{ ...ORIGINAL, linkValue: 'weekly' }, OTHER])
    expect(freshConcept.aliases).toBe(staleConcept.aliases)
    expect(freshConcept.children).toBe(staleConcept.children)
    expect(freshConcept.parent).toBe('canid')
  })

  it('editRealization keeps taxonomy realizations sorted after the update is applied', async () => {
    const staleConcept = buildStaleConcept()
    const { conceptEditsRefresh, wrapper } = buildHarness({ taxonomyConcept: staleConcept })
    const updated = { linkName: 'zebra' }

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await act(async () => {
      await result.current.editRealization(ORIGINAL, updated)
    })

    const [freshConcept] = conceptEditsRefresh.mock.calls[0]
    expect(freshConcept.realizations).toEqual([OTHER, { ...ORIGINAL, linkName: 'zebra' }])
  })

  it('editRealization skips the taxonomy update when the concept is not loaded in the taxonomy', async () => {
    const { apiFns, conceptEditsRefresh, refreshData, wrapper } = buildHarness({ taxonomyConcept: null })

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await act(async () => {
      await result.current.editRealization(ORIGINAL, { linkValue: 'weekly' })
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(updateRealization, [ORIGINAL.id, { linkValue: 'weekly' }])
    expect(refreshData).toHaveBeenCalledWith('realizations')
    expect(conceptEditsRefresh).not.toHaveBeenCalled()
  })

  it('deleteRealization removes the server realization, reloads panel data, and applies the update to the taxonomy concept in-situ', async () => {
    const staleConcept = buildStaleConcept()
    const { apiFns, conceptEditsRefresh, refreshData, wrapper } = buildHarness({
      taxonomyConcept: staleConcept,
    })

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await act(async () => {
      await result.current.deleteRealization(ORIGINAL)
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(apiDeleteRealization, ORIGINAL.id)
    expect(refreshData).toHaveBeenCalledWith('realizations')
    expect(refreshData).toHaveBeenCalledWith('pendingHistory')

    expect(conceptEditsRefresh).toHaveBeenCalledTimes(1)
    const [freshConcept, passedStale] = conceptEditsRefresh.mock.calls[0]
    expect(passedStale).toBe(staleConcept)
    expect(freshConcept.realizations).toEqual([OTHER])
    expect(freshConcept.parent).toBe('canid')
  })

  it('deleteRealization keeps the taxonomy realization for a non-admin so it can be marked pending', async () => {
    const staleConcept = buildStaleConcept()
    const { apiFns, conceptEditsRefresh, wrapper } = buildHarness({
      isAdmin: false,
      taxonomyConcept: staleConcept,
    })

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await act(async () => {
      await result.current.deleteRealization(ORIGINAL)
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(apiDeleteRealization, ORIGINAL.id)

    expect(conceptEditsRefresh).toHaveBeenCalledTimes(1)
    const [freshConcept] = conceptEditsRefresh.mock.calls[0]
    expect(freshConcept.realizations).toEqual([ORIGINAL, OTHER])
  })
})
