import { useCallback } from "react"

import { getConceptPath } from "./taxonomyItem"

import Expand from "./expandedEnum"

const allLeafs = (concept, leafs = []) => {
  if (concept.children && 0 < concept.children.length) {
    leafs.push(concept.name)
    concept.children.forEach(child => allLeafs(child, leafs))
  }
  return leafs
}

const useExpandConcept = (
  expandedItems,
  // setAutoExpand,
  setExpandedItems,
  taxonomy
) => {
  const isExpanded = useCallback(
    concept => expandedItems.includes(concept.name),
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
      const leafs = getConceptPath(taxonomy, concept)
      setExpandedItems(prevItems => [...new Set([...prevItems, ...leafs])])
    },
    [setExpandedItems, taxonomy]
  )

  const descendants = useCallback(
    concept => {
      const leafs = allLeafs(concept)
      setExpandedItems(prevItems => [...new Set([...prevItems, ...leafs])])
    },
    [setExpandedItems]
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
      // setAutoExpand(false)
    },
    [collapse, descendants, expand, toggle]
  )
}

export default useExpandConcept
