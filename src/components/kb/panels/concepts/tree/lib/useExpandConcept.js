import { use, useCallback } from 'react'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { itemPath } from './taxonomyItem'

import Expand from './expandedEnum'

const allLeafs = (concept, leafs = []) => {
  if (concept.children && 0 < concept.children.length) {
    leafs.push(concept.name)
    concept.children.forEach(child => allLeafs(child, leafs))
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
      setExpandedItems(prevItems => [...new Set([...prevItems, ...path])])
    },
    [setExpandedItems, taxonomy]
  )

  const descendants = useCallback(
    concept => {
      loadConceptDescendants(concept).then(() => {
        const leafs = allLeafs(concept)
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
        case Expand.DESCENDANTS:
          descendants(concept)
          break

        case Expand.OFF:
          collapse(concept)
          break

        case Expand.ON:
          expand(concept)
          break

        case Expand.TOGGLE:
          toggle(concept)
          break
      }
    },
    [collapse, descendants, expand, toggle]
  )
}

export default useExpandConcept
