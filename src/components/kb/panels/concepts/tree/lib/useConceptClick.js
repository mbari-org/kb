import { useCallback } from "react"

import Expand from "./expandedEnum"

const useConceptClick = (concept, expandConcept, selectConcept) => {
  return useCallback(
    itemId =>
      itemId === concept.name
        ? expandConcept(concept, Expand.TOGGLE)
        : selectConcept(itemId),
    [concept, expandConcept, selectConcept]
  )
}

export default useConceptClick
