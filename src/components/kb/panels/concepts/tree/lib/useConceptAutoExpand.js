import { useEffect } from 'react'

import Expand from './expandedEnum'

const useConceptAutoExpand = ({
  autoExpand,
  concept,
  expandConcept,
  getConceptPrimaryName,
  setAutoExpand,
}) => {
  useEffect(() => {
    if (!concept) {
      return
    }

    // Expand concept on initial load
    if (autoExpand === null) {
      setAutoExpand({ expand: true, name: concept.name })
      return
    }

    if (!autoExpand) {
      return
    }

    if (
      autoExpand.name === concept.name ||
      getConceptPrimaryName(autoExpand.name) === concept.name
    ) {
      expandConcept(concept, Expand.ON)
      setAutoExpand({ expand: false, name: null })
    }
  }, [autoExpand, concept, expandConcept, getConceptPrimaryName, setAutoExpand])
}

export default useConceptAutoExpand
