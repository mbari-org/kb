import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import useTaxonomyIntegrity from '@/lib/hooks/useTaxonomyIntegrity'

const createConcept = ({ alternateNames = [], children, name, parent }) => {
  const concept = {
    alternateNames,
    media: [],
    name,
    parent,
    realizations: [],
    references: [],
    templates: [],
  }

  if (children !== undefined) {
    concept.children = children
  }

  return concept
}

const createTaxonomy = () => {
  const root = createConcept({ children: ['parent'], name: 'root', parent: undefined })
  const parent = createConcept({
    alternateNames: ['parent-alias'],
    children: undefined,
    name: 'parent',
    parent: 'root',
  })

  return {
    aliasMap: {
      'parent-alias': parent,
    },
    conceptMap: {
      parent,
      root,
    },
    names: ['parent', 'parent-alias', 'root'],
    rootName: 'root',
  }
}

describe('useTaxonomyIntegrity', () => {
  it('accepts a valid partially loaded taxonomy', () => {
    const taxonomy = createTaxonomy()
    const { result } = renderHook(() => useTaxonomyIntegrity())

    expect(() => result.current(taxonomy)).not.toThrow()
  })

  it('throws when a concept contains duplicate child references', () => {
    const taxonomy = createTaxonomy()
    taxonomy.conceptMap.parent.children = ['child', 'child']
    taxonomy.conceptMap.child = createConcept({
      children: [],
      name: 'child',
      parent: 'parent',
    })
    taxonomy.names = ['child', 'parent', 'parent-alias', 'root']

    const { result } = renderHook(() => useTaxonomyIntegrity())

    expect(() => result.current(taxonomy)).toThrow(/duplicate child reference "child"/)
  })

  it('throws when aliasMap points to a different object than conceptMap', () => {
    const taxonomy = createTaxonomy()
    taxonomy.aliasMap['parent-alias'] = { ...taxonomy.conceptMap.parent }

    const { result } = renderHook(() => useTaxonomyIntegrity())

    expect(() => result.current(taxonomy)).toThrow(
      /aliasMap alias "parent-alias" points to a concept object that differs/
    )
  })
})
