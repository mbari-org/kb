import { use, useCallback } from 'react'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { itemPath } from './taxonomyItem'

import { CONCEPT_EXPAND } from '@/lib/constants'

const allLeafs = (taxonomy, conceptName, leafs = []) => {
  const concept = taxonomy.conceptMap[conceptName]
  if (0 < concept.children.length) {
    leafs.push(concept.name)
    concept.children.forEach(child => allLeafs(taxonomy, child, leafs))
  }
  return leafs
}

const useExpandConcept = (expandedItems, setExpandedItems, taxonomy) => {
  const { loadConceptDescendants } = use(TaxonomyContext)

  const isExpanded = useCallback(
    concept => {
      return expandedItems.includes(concept.name)
    },
    [expandedItems]
  )

  const collapse = useCallback(
    concept => {
      setExpandedItems(prevItems => prevItems.filter(id => id !== concept.name))
    },
    [setExpandedItems]
  )

  const expand = useCallback(
    concept => {
      const path = itemPath(taxonomy, concept)
      if (path) {
        setExpandedItems(prevItems => [...new Set([...prevItems, ...path])])
      }
    },
    [setExpandedItems, taxonomy]
  )

  const descendants = useCallback(
    concept => {
      loadConceptDescendants(concept).then(updatedTaxonomy => {
        const leafs = allLeafs(updatedTaxonomy, concept.name)
        setExpandedItems(prevItems => [...new Set([...prevItems, ...leafs])])
      })
    },
    [loadConceptDescendants, setExpandedItems]
  )

  const toggle = useCallback(
    concept => {
      isExpanded(concept) ? collapse(concept) : expand(concept)
    },
    [collapse, expand, isExpanded]
  )

  return useCallback(
    (concept, expanded) => {
      switch (expanded) {
        case CONCEPT_EXPAND.DESCENDANTS:
          descendants(concept)
          break

        case CONCEPT_EXPAND.OFF:
          collapse(concept)
          break

        case CONCEPT_EXPAND.ON:
          expand(concept)
          break

        case CONCEPT_EXPAND.TOGGLE:
          toggle(concept)
          break
      }
    },
    [collapse, descendants, expand, toggle]
  )
}

export default useExpandConcept
