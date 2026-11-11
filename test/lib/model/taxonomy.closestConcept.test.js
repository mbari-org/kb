import { describe, expect, it } from 'vitest'

import { closestConcept } from '@/lib/model/taxonomy'

const concept = (name, extra = {}) => ({ name, ...extra })

const taxonomyWith = conceptMap => ({ aliasMap: {}, conceptMap })

describe('closestConcept', () => {
  const parent = concept('science', { children: ['CDF', 'NetCDF', 'h5'] })
  const taxonomy = taxonomyWith({
    science: parent,
    CDF: concept('CDF', { parent: 'science' }),
    NetCDF: concept('NetCDF', { parent: 'science' }),
    h5: concept('h5', { parent: 'science' }),
  })

  it('returns the next sibling for a first child', () => {
    expect(closestConcept(taxonomy, concept('CDF', { parent: 'science' }))).toBe(taxonomy.conceptMap.NetCDF)
  })

  it('returns the previous sibling for a later child', () => {
    expect(closestConcept(taxonomy, concept('NetCDF', { parent: 'science' }))).toBe(taxonomy.conceptMap.CDF)
  })

  it('returns the parent when the concept is the only child', () => {
    const singleParent = concept('science', { children: ['NetCDF'] })
    const singleTaxonomy = taxonomyWith({ science: singleParent, NetCDF: concept('NetCDF', { parent: 'science' }) })

    expect(closestConcept(singleTaxonomy, concept('NetCDF', { parent: 'science' }))).toBe(singleParent)
  })

  it('returns the parent when the parent\'s children are not loaded', () => {
    const skeletonParent = concept('science')
    const skeletonTaxonomy = taxonomyWith({ science: skeletonParent })

    expect(closestConcept(skeletonTaxonomy, concept('NetCDF', { parent: 'science' }))).toBe(skeletonParent)
  })

  it('returns null when the parent is not in the taxonomy', () => {
    expect(closestConcept(taxonomyWith({}), concept('NetCDF', { parent: 'science' }))).toBeNull()
  })
})
