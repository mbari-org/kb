import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getReferences as getReferencesApi } from '@/lib/api/references'
import { PAGINATION } from '@/lib/constants/pagination.js'
import useLoadReferences from '@/contexts/panel/data/useLoadReferences'

const { createReferenceMock } = vi.hoisted(() => ({
  createReferenceMock: vi.fn(reference => ({ ...reference, mapped: true })),
}))

vi.mock('@/lib/model/reference', () => ({
  createReference: reference => createReferenceMock(reference),
}))

describe('useLoadReferences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads and maps references until a short page is encountered', async () => {
    const pageSize = PAGINATION.REFERENCES.EXPORT_PAGE_SIZE
    const firstPage = [{ id: 'ref-1' }, { id: 'ref-2' }]
    const apiFns = {
      apiPaginated: vi.fn(async () => firstPage),
    }

    const { result } = renderHook(() => useLoadReferences(apiFns))

    let references
    await act(async () => {
      references = await result.current()
    })

    expect(apiFns.apiPaginated).toHaveBeenCalledWith(getReferencesApi, {
      limit: pageSize,
      offset: 0,
    })
    expect(references).toEqual([
      { id: 'ref-1', mapped: true },
      { id: 'ref-2', mapped: true },
    ])
  })

  it('throws when pagination repeats a previously seen page', async () => {
    const pageSize = PAGINATION.REFERENCES.EXPORT_PAGE_SIZE
    const repeatedPage = Array.from({ length: pageSize }, (_, index) => ({
      id: `ref-${index}`,
    }))
    const apiFns = {
      apiPaginated: vi.fn(async () => repeatedPage),
    }

    const { result } = renderHook(() => useLoadReferences(apiFns))

    await expect(result.current()).rejects.toMatchObject({
      title: 'Invalid References Pagination',
      message: 'Reference pagination repeated a previous page and would not terminate',
    })
  })
})
