import { useCallback } from "react"

import { getConceptPath } from "./taxonomyItem"

import Expand from "./expandedEnum"

const collapseConcept = (expandedItems, setExpandedItems) => {
  return concept => {
    setExpandedItems(expandedItems.filter(id => id !== concept.name))
  }
}

const expandConcept = (setExpandedItems, taxonomy) => {
  return concept => {
    const leafs = getConceptPath(taxonomy, concept)
    setExpandedItems(prevItems => [...new Set([...prevItems, ...leafs])])
  }
}

const expandDescendants = setExpandedItems => {
  const allLeafs = (concept, leafs = []) => {
    if (concept.children && 0 < concept.children.length) {
      leafs.push(concept.name)
      concept.children.forEach(child => allLeafs(child, leafs))
    }
    return leafs
  }

  return concept => {
    const leafs = allLeafs(concept)
    setExpandedItems(prevItems => [...new Set([...prevItems, ...leafs])])
  }
}

const toggleConcept = (expandedItems, setExpandedItems, taxonomy) => {
  return concept => {
    if (!expandedItems.includes(concept.name)) {
      const leafs = getConceptPath(taxonomy, concept)
      setExpandedItems(prevItems => [...new Set([...prevItems, ...leafs])])
    } else {
      setExpandedItems(expandedItems.filter(id => id !== concept.name))
    }
  }
}

const useExpandConcept = (expandedItems, setExpandedItems, taxonomy) => {
  const collapse = collapseConcept(expandedItems, setExpandedItems)
  const descendants = expandDescendants(setExpandedItems)
  const expand = expandConcept(setExpandedItems, taxonomy)
  const toggle = toggleConcept(expandedItems, setExpandedItems, taxonomy)

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
