import { describe, expect, it, vi } from 'vitest'

import { deleteConceptByName } from '@/lib/api/concept'
import { deleteConcept } from '@/lib/model/taxonomy'

const concept = (name, extra = {}) => ({ name, alternateNames: [], children: [], media: [], ...extra })

const buildTaxonomy = () => {
  const doomed = concept('doomed', { parent: 'science' })
  const science = concept('science', { children: ['doomed'] })
  const taxonomy = {
    aliasMap: {},
    conceptMap: { doomed, science },
    names: ['doomed', 'science'],
    rootName: 'science',
  }
  return { doomed, taxonomy }
}

describe('deleteConcept', () => {
  it('removes the concept from the taxonomy once the delete is confirmed', async () => {
    const { doomed, taxonomy } = buildTaxonomy()
    const apiFns = {
      apiPayload: vi.fn(async () => ['science']),
      apiWrite: vi.fn(async () => ({})),
    }

    const { closestConcept, taxonomy: updated } = await deleteConcept(taxonomy, doomed, apiFns)

    expect(apiFns.apiWrite).toHaveBeenCalledWith(deleteConceptByName, 'doomed')
    expect(updated.conceptMap.doomed).toBeUndefined()
    expect(updated.conceptMap.science.children).toEqual([])
    expect(updated.names).toEqual(['science'])
    expect(closestConcept.name).toBe('science')
  })

  it('leaves the taxonomy unchanged when the delete request is rejected', async () => {
    const { doomed, taxonomy } = buildTaxonomy()
    const apiFns = {
      apiPayload: vi.fn(),
      apiWrite: vi.fn(async () => {
        throw { title: 'Server Error', message: 'boom', details: {}, status: 500 }
      }),
    }

    await expect(deleteConcept(taxonomy, doomed, apiFns)).rejects.toMatchObject({ status: 500 })

    expect(taxonomy.conceptMap.doomed).toBe(doomed)
    expect(taxonomy.conceptMap.science.children).toEqual(['doomed'])
    expect(taxonomy.names).toEqual(['doomed', 'science'])
    expect(apiFns.apiPayload).not.toHaveBeenCalled()
  })
})
