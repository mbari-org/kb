import { useCallback } from 'react'

import { CONCEPT_EXPAND } from '@/lib/constants'

const useConceptClick = (concept, expandConcept, selectConcept, setAutoExpand) => {
  return useCallback(
    (_event, conceptName) => {
      if (conceptName === concept.name) {
        setAutoExpand({ expand: false, name: null })
        expandConcept(concept, CONCEPT_EXPAND.TOGGLE)
      } else {
        selectConcept(conceptName)
        setAutoExpand({ expand: true, name: conceptName })
      }
    },
    [concept, expandConcept, selectConcept, setAutoExpand]
  )
}

export default useConceptClick
