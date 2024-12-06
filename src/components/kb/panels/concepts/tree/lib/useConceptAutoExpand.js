import { useEffect } from "react"

import Expand from "./expandedEnum"

const useConceptAutoExpand = (
  concept,
  autoExpand,
  setAutoExpand,
  expandConcept
) => {
  useEffect(() => {
    // Expand concept on initial load
    if (concept && autoExpand === null) {
      setAutoExpand({ expand: true, name: concept.name })
    } else if (
      concept &&
      autoExpand.expand &&
      autoExpand.name === concept.name
    ) {
      expandConcept(concept, Expand.ON)
      setAutoExpand({ expand: false, name: null })
    }
  }, [autoExpand, concept, expandConcept, setAutoExpand])
}

export default useConceptAutoExpand
