import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getConceptById, getConceptChildren, getConceptNameById, getConceptParent } from '@/lib/api/concept'
import { loadConceptById } from '@/lib/model/concept'

const normalizeConceptMock = vi.fn()

vi.mock('@/lib/api/concept', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    normalizeConcept: (...args) => normalizeConceptMock(...args),
  }
})

const serverRoutes = ({ name = 'dingo', parent = 'root', children = ['pup'] } = {}) =>
  new Map([
    [
      getConceptById,
      () => ({ id: 42, name, rankLevel: 'Species', rankName: 'Species', alternateNames: ['old'], author: '' }),
    ],
    [
      getConceptNameById,
      () => ({
        id: 42,
        names: [
          { id: 7, name, nameType: 'Primary', author: 'Smith' },
          { id: 8, name: 'old', nameType: 'Former', author: '' },
        ],
      }),
    ],
    [getConceptChildren, () => children.map(child => ({ id: 9, name: child }))],
    [getConceptParent, () => ({ name: parent })],
  ])

const apiFnsWith = routes => ({
  apiPayload: vi.fn(async (fn, param) => routes.get(fn)(param)),
})

describe('loadConceptById', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    normalizeConceptMock.mockImplementation(async (_apiFns, concept) => ({ ...concept, media: [] }))
  })

  it('builds the concept from its id, primary name id, and name-addressed structure reads', async () => {
    const apiFns = apiFnsWith(serverRoutes())

    const concept = await loadConceptById(apiFns, { id: 42, name: 'dingo', primaryNameId: 7 }, false)

    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptById, 42)
    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptNameById, 7)
    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptChildren, 'dingo')
    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptParent, 'dingo')
    expect(concept).toMatchObject({
      alternateNames: ['old'],
      aliases: [{ id: 8, name: 'old', nameType: 'Former', author: '' }],
      author: 'Smith',
      children: ['pup'],
      id: 42,
      media: [],
      name: 'dingo',
      parent: 'root',
      primaryNameId: 7,
      rankName: 'Species',
    })
  })

  it('takes the concept name from the server so a rename is followed', async () => {
    const apiFns = apiFnsWith(serverRoutes({ name: 'wolf' }))

    const concept = await loadConceptById(apiFns, { id: 42, name: 'dingo', primaryNameId: 7 }, false)

    expect(concept.name).toBe('wolf')
    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptChildren, 'wolf')
    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptParent, 'wolf')
  })

  it('does not read a parent for the root concept', async () => {
    const apiFns = apiFnsWith(serverRoutes({ name: 'Animalia' }))

    const concept = await loadConceptById(apiFns, { id: 42, name: 'Animalia', primaryNameId: 7 }, true)

    expect(apiFns.apiPayload).not.toHaveBeenCalledWith(getConceptParent, expect.anything())
    expect(concept.parent).toBeUndefined()
  })

  it('sorts the children it returns', async () => {
    const apiFns = apiFnsWith(serverRoutes({ children: ['pup', 'Alpha'] }))

    const concept = await loadConceptById(apiFns, { id: 42, name: 'dingo', primaryNameId: 7 }, false)

    expect(concept.children).toEqual(['Alpha', 'pup'])
  })

  it('normalizes the loaded concept', async () => {
    const apiFns = apiFnsWith(serverRoutes())

    await loadConceptById(apiFns, { id: 42, name: 'dingo', primaryNameId: 7 }, false)

    expect(normalizeConceptMock).toHaveBeenCalledWith(apiFns, expect.objectContaining({ name: 'dingo' }))
  })
})
