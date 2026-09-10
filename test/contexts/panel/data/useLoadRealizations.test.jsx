import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { getConceptLinkRealizations, getRealizations } from '@/lib/api/realizations'
import { PAGINATION } from '@/lib/constants/pagination.js'
import useLoadRealizations from '@/contexts/panel/data/useLoadRealizations'

const PAGE_SIZE = Math.max(...PAGINATION.REALIZATIONS.PAGE_SIZE_OPTIONS)

const fullPage = offset => Array.from({ length: PAGE_SIZE }, (_, index) => ({ id: `r-${offset + index}` }))

describe('useLoadRealizations', () => {
  it('loads pages in parallel batches until a short page is encountered', async () => {
    const calls = []
    const apiFns = {
      apiPayload: vi.fn(async (fn, { offset }) => {
        calls.push(offset)
        if (offset === 500) return [{ id: 'r-500' }]
        return fullPage(offset)
      }),
    }

    const { result } = renderHook(() => useLoadRealizations(apiFns))

    let realizations
    await act(async () => {
      realizations = await result.current()
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(getRealizations, { limit: PAGE_SIZE, offset: 0 })
    expect(calls.slice(0, 5)).toEqual([0, 100, 200, 300, 400])
    expect(calls.length).toBe(10)
    expect(realizations).toHaveLength(5 * PAGE_SIZE + 1)
  })

  it('returns an empty array when the first page is empty', async () => {
    const apiFns = { apiPayload: vi.fn(async () => []) }

    const { result } = renderHook(() => useLoadRealizations(apiFns))

    let realizations
    await act(async () => {
      realizations = await result.current()
    })

    expect(realizations).toEqual([])
  })

  it('loads realizations for a single concept via the concept endpoint', async () => {
    const apiFns = {
      apiPayload: vi.fn(async () => [{ id: 'r-1', linkName: 'eats', toConcept: 'D', linkValue: 'daily' }]),
    }

    const { result } = renderHook(() => useLoadRealizations(apiFns))

    let realizations
    await act(async () => {
      realizations = await result.current('C')
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptLinkRealizations, 'C')
    expect(realizations).toEqual([
      expect.objectContaining({ id: 'r-1', concept: 'C', linkName: 'eats', toConcept: 'D', linkValue: 'daily' }),
    ])
  })
})
