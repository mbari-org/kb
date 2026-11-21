import { describe, expect, it, vi } from 'vitest'

import { getConceptNames } from '@/lib/api/concept'
import { loadAliases, loadConceptNames } from '@/lib/model/aliases'

const rawNames = [
  { author: '', id: 3, name: 'Rhincodon pacificus', nameType: 'synonym' },
  { author: '', id: 1, name: 'Rhincodon typus', nameType: 'primary' },
  { author: '', id: 2, name: 'Whale shark', nameType: 'common' },
]

describe('loadConceptNames', () => {
  it('returns ordered aliases and the primary name id from one names read', async () => {
    const apiFns = { apiPayload: vi.fn(async () => rawNames) }

    const names = await loadConceptNames(apiFns, 'Rhincodon typus')

    expect(apiFns.apiPayload).toHaveBeenCalledTimes(1)
    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptNames, 'Rhincodon typus')
    expect(names.primaryNameId).toBe(1)
    expect(names.aliases.map(alias => alias.name)).toEqual(['Whale shark', 'Rhincodon pacificus'])
  })
})

describe('loadAliases', () => {
  it('returns ordered aliases without writing to a concept whose names are not loaded', async () => {
    const apiFns = { apiPayload: vi.fn(async () => rawNames) }
    const concept = { name: 'Rhincodon typus' }

    const aliases = await loadAliases(apiFns, concept)

    expect(aliases.map(alias => alias.name)).toEqual(['Whale shark', 'Rhincodon pacificus'])
    expect(concept).toEqual({ name: 'Rhincodon typus' })
  })

  it('returns loaded aliases without a names read', async () => {
    const apiFns = { apiPayload: vi.fn() }
    const aliases = [{ name: 'Whale shark', nameType: 'Common' }]

    expect(await loadAliases(apiFns, { aliases, name: 'Rhincodon typus' })).toBe(aliases)
    expect(apiFns.apiPayload).not.toHaveBeenCalled()
  })
})
