import { useCallback } from "react"

import { getConceptPath } from "./taxonomyItem"

const useExpandConcept = (expandedItems, setExpandedItems, taxonomy) => {
  const expandConcept = useCallback(
    (concept, expand = true) => {
      if (expand && !expandedItems.includes(concept.name)) {
        const leafs = getConceptPath(taxonomy, concept)
        setExpandedItems(prevItems => [...new Set([...prevItems, ...leafs])])
      }
      if (!expand && expandedItems.includes(concept.name)) {
        setExpandedItems(expandedItems.filter(id => id !== concept.name))
      }
    },
    [expandedItems, setExpandedItems, taxonomy]
  )

  return expandConcept
}

export default useExpandConcept
