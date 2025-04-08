import { useCallback } from 'react'

import { getNextSibling, getPrevSibling } from '@/lib/kb/model/concept'

import Expand from './expandedEnum'

const useArrowNavigation = (
  concept,
  expandConcept,
  getConcept,
  isExpanded,
  selectConcept,
  setAutoExpand
) => {
  return useCallback(
    event => {
      let navToConceptName
      switch (event.key) {
        case 'ArrowDown': {
          const isConceptExpanded = isExpanded(concept)

          if (isConceptExpanded) {
            navToConceptName = concept.children[0]
            break
          }

          const nextSibling = getNextSibling(concept, getConcept)
          if (!isConceptExpanded && nextSibling) {
            navToConceptName = nextSibling
            break
          }

          if (!nextSibling) {
            let parentConcept = getConcept(concept.parent)
            while (parentConcept) {
              const parentNextSibling = getNextSibling(parentConcept, getConcept)
              if (parentNextSibling) {
                navToConceptName = parentNextSibling
                break
              } else {
                parentConcept = getConcept(parentConcept.parent)
              }
            }
          }
          break
        }

        case 'ArrowUp': {
          const prevSibling = getPrevSibling(concept, getConcept)
          if (prevSibling) {
            let prevConcept = getConcept(prevSibling)
            while (isExpanded(prevConcept)) {
              prevConcept = getConcept(prevConcept.children[prevConcept.children.length - 1])
            }
            navToConceptName = prevConcept.name
          } else {
            navToConceptName = concept.parent
          }
          break
        }

        case 'ArrowLeft': {
          isExpanded(concept)
            ? expandConcept(concept, Expand.OFF)
            : (navToConceptName = concept.parent)
          break
        }

        case 'ArrowRight':
          expandConcept(concept, event.altKey && event.ctrlKey ? Expand.DESCENDANTS : Expand.ON)
          break
        default:
          break
      }

      if (navToConceptName) {
        selectConcept(navToConceptName)
        setAutoExpand({ expand: false, name: navToConceptName })
      }
    },
    [isExpanded, concept, expandConcept, getConcept, setAutoExpand, selectConcept]
  )
}

export default useArrowNavigation
