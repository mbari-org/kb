import { useCallback } from 'react'

import { treeItemClasses } from '@mui/x-tree-view'

import { CONCEPT } from '@/lib/constants'

const DISCLOSURE_SELECTOR = `.${treeItemClasses.iconContainer}`

const useConceptClick = (concept, conceptPath, expandConcept, selectConcept, setAutoExpand, expandedItems) => {
  return useCallback(
    (event, conceptName) => {
      if (event.target.closest(DISCLOSURE_SELECTOR) && expandedItems.includes(conceptName)) {
        expandConcept({ name: conceptName }, CONCEPT.EXPAND.OFF)
        if (conceptName !== concept.name && conceptPath?.includes(conceptName)) {
          expandConcept(concept, CONCEPT.EXPAND.TO_PARENT)
        }
        return
      }

      if (conceptName === concept.name) {
        setAutoExpand({ expand: false, name: null })
        expandConcept(concept, event.altKey ? CONCEPT.EXPAND.DESCENDANTS : CONCEPT.EXPAND.TOGGLE)
      } else {
        selectConcept(conceptName)
        setAutoExpand({ expand: false, name: null })
      }
    },
    [concept, conceptPath, expandConcept, expandedItems, selectConcept, setAutoExpand]
  )
}

export default useConceptClick
