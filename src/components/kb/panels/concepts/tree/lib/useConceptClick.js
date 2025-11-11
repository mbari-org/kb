import { useCallback } from 'react'

import { CONCEPT } from '@/lib/constants.js'

const useConceptClick = (concept, expandConcept, selectConcept, setAutoExpand) => {
  return useCallback(
    (_event, conceptName) => {
      if (conceptName === concept.name) {
        setAutoExpand({ expand: false, name: null })
        expandConcept(concept, CONCEPT.EXPAND.TOGGLE)
      } else {
        selectConcept(conceptName)
        setAutoExpand({ expand: false, name: null })
      }
    },
    [concept, expandConcept, selectConcept, setAutoExpand]
  )
}

export default useConceptClick
