import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import useModifyRealizations from '@/contexts/panels/realizations/useModifyRealizations'

import {
  createRealization as apiCreateRealization,
  deleteRealization as apiDeleteRealization,
  updateRealization,
} from '@/lib/api/realizations'

const ORIGINAL = { id: 7, concept: 'dingo', linkName: 'eats', toConcept: 'fish', linkValue: 'daily' }

const buildHarness = () => {
  const apiFns = { apiPayload: vi.fn(async () => ({})) }
  const refreshData = vi.fn(async () => ({}))
  const reloadConceptRealizations = vi.fn(async conceptName => [{ ...ORIGINAL, concept: conceptName }])

  const wrapper = ({ children }) => (
    <ConfigContext.Provider value={{ apiFns }}>
      <PanelDataContext.Provider value={{ refreshData, reloadConceptRealizations }}>
        {children}
      </PanelDataContext.Provider>
    </ConfigContext.Provider>
  )

  return { apiFns, refreshData, reloadConceptRealizations, wrapper }
}

describe('useModifyRealizations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('editRealization updates the server then reloads the concept realizations and pending history', async () => {
    const { apiFns, refreshData, reloadConceptRealizations, wrapper } = buildHarness()
    const updated = { linkValue: 'weekly' }

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await act(async () => {
      await result.current.editRealization(ORIGINAL, updated)
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(updateRealization, [ORIGINAL.id, updated])
    expect(reloadConceptRealizations).toHaveBeenCalledWith(ORIGINAL.concept)
    expect(refreshData).toHaveBeenCalledWith('pendingHistory')
  })

  it('editRealization does not touch the cache when the server update fails', async () => {
    const { apiFns, refreshData, reloadConceptRealizations, wrapper } = buildHarness()
    apiFns.apiPayload.mockRejectedValue(new Error('server down'))

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await expect(
      act(async () => {
        await result.current.editRealization(ORIGINAL, { linkValue: 'weekly' })
      })
    ).rejects.toThrow('Failed to update realization')

    expect(reloadConceptRealizations).not.toHaveBeenCalled()
    expect(refreshData).not.toHaveBeenCalled()
  })

  it('deleteRealization deletes on the server then reloads the concept realizations and pending history', async () => {
    const { apiFns, refreshData, reloadConceptRealizations, wrapper } = buildHarness()

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await act(async () => {
      await result.current.deleteRealization(ORIGINAL)
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(apiDeleteRealization, ORIGINAL.id)
    expect(reloadConceptRealizations).toHaveBeenCalledWith(ORIGINAL.concept)
    expect(refreshData).toHaveBeenCalledWith('pendingHistory')
  })

  it('deleteRealization does not touch the cache when the server delete fails', async () => {
    const { apiFns, refreshData, reloadConceptRealizations, wrapper } = buildHarness()
    apiFns.apiPayload.mockRejectedValue(new Error('server down'))

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await expect(
      act(async () => {
        await result.current.deleteRealization(ORIGINAL)
      })
    ).rejects.toThrow('Failed to delete realization')

    expect(reloadConceptRealizations).not.toHaveBeenCalled()
    expect(refreshData).not.toHaveBeenCalled()
  })

  it('addRealization creates on the server then reloads the concept realizations and pending history', async () => {
    const { apiFns, refreshData, reloadConceptRealizations, wrapper } = buildHarness()
    const realization = { concept: 'dingo', linkName: 'eats', toConcept: 'fish', linkValue: 'daily' }

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await act(async () => {
      await result.current.addRealization(realization)
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(apiCreateRealization, realization)
    expect(reloadConceptRealizations).toHaveBeenCalledWith(realization.concept)
    expect(refreshData).toHaveBeenCalledWith('pendingHistory')
  })

  it('addRealization does not touch the cache when the server create fails', async () => {
    const { apiFns, refreshData, reloadConceptRealizations, wrapper } = buildHarness()
    apiFns.apiPayload.mockRejectedValue(new Error('server down'))
    const realization = { concept: 'dingo', linkName: 'eats', toConcept: 'fish', linkValue: 'daily' }

    const { result } = renderHook(() => useModifyRealizations(), { wrapper })
    await expect(
      act(async () => {
        await result.current.addRealization(realization)
      })
    ).rejects.toThrow('Failed to add realization')

    expect(reloadConceptRealizations).not.toHaveBeenCalled()
    expect(refreshData).not.toHaveBeenCalled()
  })
})
