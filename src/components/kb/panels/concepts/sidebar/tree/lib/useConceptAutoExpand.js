import { useEffect } from 'react'

import { CONCEPT } from '@/lib/constants'

const useConceptAutoExpand = ({
  autoExpand,
  concept,
  expandConcept,
  getConceptPrimaryName,
  setAutoExpand,
}) => {
  useEffect(() => {
    if (!concept) return

    // Expand concept on initial load
    if (autoExpand === null) {
      setAutoExpand({ expand: true, name: concept.name })
      return
    }

    if (!autoExpand?.expand) return

    const target = getConceptPrimaryName(autoExpand.name) || autoExpand.name
    if (target === concept.name) {
      expandConcept(concept, CONCEPT.EXPAND.ON)
      setAutoExpand({ expand: false, name: null })
    }
  }, [autoExpand, concept, expandConcept, getConceptPrimaryName, setAutoExpand])
}

export default useConceptAutoExpand
