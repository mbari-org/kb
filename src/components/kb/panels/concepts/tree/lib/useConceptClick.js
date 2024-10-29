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
        setAutoExpand({ expand: false, name: null })
        expandConcept(concept, Expand.TOGGLE)
      } else {
        selectConcept(conceptName)
        setAutoExpand({ expand: true, name: conceptName })
      }
    },
    [concept, expandConcept, selectConcept, setAutoExpand]
  )
}

export default useConceptClick
