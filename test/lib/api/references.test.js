import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/services/oni/methods', () => ({
  oniDelete: vi.fn(),
  oniGet: vi.fn(),
  oniPost: vi.fn(),
  oniPut: vi.fn(),
}))

import { oniPut } from '@/lib/services/oni/methods'
import { addReferenceConcept, removeReferenceConcept, renameReferenceConcept } from '@/lib/api/references'

describe('references API', () => {
  it('adds a concept to a reference', async () => {
    oniPut.mockResolvedValueOnce({ payload: { id: 10 } })
    const config = { url: 'https://example.test' }

    await addReferenceConcept(config, [10, 'Aulacoctena'])

    expect(oniPut).toHaveBeenCalledWith({
      config,
      path: ['references', 'add', 10, 'to', 'Aulacoctena'],
    })
  })

  it('removes a concept from a reference', async () => {
    oniPut.mockResolvedValueOnce({ payload: { id: 10 } })
    const config = { url: 'https://example.test' }

    await removeReferenceConcept(config, [10, 'Bathyctena'])

    expect(oniPut).toHaveBeenCalledWith({
      config,
      path: ['references', 'remove', 10, 'from', 'Bathyctena'],
    })
  })

  it('sequentially removes oldName then adds newName when renaming a concept', async () => {
    const callOrder = []
    oniPut.mockImplementation(async ({ path }) => {
      callOrder.push(path.join('/'))
      return { payload: { id: 10 } }
    })

    const config = { url: 'https://example.test' }
    await renameReferenceConcept(config, [10, 'OldConcept', 'NewConcept'])

    expect(callOrder).toEqual(['references/remove/10/from/OldConcept', 'references/add/10/to/NewConcept'])
  })
})
