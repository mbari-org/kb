import { useCallback } from "react"

import Expand from "./expandedEnum"

const useConceptClick = (
  concept,
  expandConcept,
  selectConcept,
  setAutoExpand
) => {
  return useCallback(
    conceptName => {
      if (conceptName === concept.name) {
        setAutoExpand(false)
        expandConcept(concept, Expand.TOGGLE)
      } else {
        selectConcept(conceptName)
        setAutoExpand(true)
      }
    },
    [concept, expandConcept, selectConcept, setAutoExpand]
  )
}

export default useConceptClick
