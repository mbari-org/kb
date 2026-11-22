import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/services/oni/methods', () => ({
  oniGet: vi.fn(),
  oniUserDelete: vi.fn(),
  oniUserPut: vi.fn(),
}))

import { oniGet, oniUserDelete, oniUserPut } from '@/lib/services/oni/methods'
import {
  deleteConceptById,
  deleteConceptNameById,
  getConceptById,
  getConceptNamesById,
  updateConceptById,
  updateConceptNameById,
} from '@/lib/api/concept'

const config = { url: 'https://example.test' }

describe('concept API by id', () => {
  it('fetches a concept by id', async () => {
    oniGet.mockResolvedValueOnce({ payload: { id: 42, name: 'Aulacoctena' } })

    const result = await getConceptById(config, 42)

    expect(oniGet).toHaveBeenCalledWith({
      config,
      path: ['concept', 'id', 42],
    })
    expect(result).toEqual({ payload: { id: 42, name: 'Aulacoctena' } })
  })

  it('deletes a concept by id', async () => {
    oniUserDelete.mockResolvedValueOnce({ payload: {} })

    const result = await deleteConceptById(config, 42)

    expect(oniUserDelete).toHaveBeenCalledWith({
      config,
      path: ['concept', 'id', 42],
    })
    expect(result).toEqual({ payload: {} })
  })

  it('updates a concept by id', async () => {
    oniUserPut.mockResolvedValueOnce({ payload: { id: 42 } })
    const updates = { rankLevel: 'Species' }

    const result = await updateConceptById(config, [42, updates])

    expect(oniUserPut).toHaveBeenCalledWith({
      config,
      path: ['concept', 'id', 42],
      data: updates,
    })
    expect(result).toEqual({ payload: { id: 42 } })
  })
})

describe('concept name API by id', () => {
  it('updates a concept name by id', async () => {
    oniUserPut.mockResolvedValueOnce({ payload: { id: 7 } })
    const updates = { newName: 'wolf' }

    const result = await updateConceptNameById(config, [7, updates])

    expect(oniUserPut).toHaveBeenCalledWith({
      config,
      path: ['names', 'id', 7],
      data: updates,
    })
    expect(result).toEqual({ payload: { id: 7 } })
  })

  it('fetches a concept name by id', async () => {
    oniGet.mockResolvedValueOnce({ payload: { id: 7 } })

    const result = await getConceptNamesById(config, 7)

    expect(oniGet).toHaveBeenCalledWith({
      config,
      path: ['names', 'id', 7],
    })
    expect(result).toEqual({ payload: { id: 7 } })
  })

  it('deletes a concept name by id', async () => {
    oniUserDelete.mockResolvedValueOnce({ payload: {} })

    const result = await deleteConceptNameById(config, 7)

    expect(oniUserDelete).toHaveBeenCalledWith({
      config,
      path: ['names', 'id', 7],
    })
    expect(result).toEqual({ payload: {} })
  })
})
