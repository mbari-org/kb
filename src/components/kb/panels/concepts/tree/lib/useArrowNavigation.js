import { useCallback } from 'react'

import { getNextSibling, getPrevSibling } from '@/lib/kb/concept'

import Expand from './expandedEnum'

const useArrowNavigation = (concept, expandConcept, isExpanded, selectConcept, setAutoExpand) => {
  return useCallback(
    event => {
      let navToConcept
      switch (event.key) {
        case 'ArrowDown': {
          const isConceptExpanded = isExpanded(concept)

          if (isConceptExpanded) {
            navToConcept = concept.children[0]
            break
          }

          const nextSibling = getNextSibling(concept)
          if (!isConceptExpanded && nextSibling) {
            navToConcept = nextSibling
            break
          }

          if (!nextSibling) {
            let parent = concept.parent
            while (parent) {
              const parentNextSibling = getNextSibling(parent)
              if (parentNextSibling) {
                navToConcept = parentNextSibling
                break
              } else {
                parent = parent.parent
              }
            }
          }
          break
        }

        case 'ArrowUp': {
          const prevSibling = getPrevSibling(concept)
          if (prevSibling) {
            let prevConcept = prevSibling
            while (isExpanded(prevConcept)) {
              prevConcept = prevConcept.children[prevConcept.children.length - 1]
            }
            navToConcept = prevConcept
          } else {
            navToConcept = concept.parent
          }
          break
        }

        case 'ArrowLeft': {
          if (isExpanded(concept)) {
            expandConcept(concept, Expand.OFF)
          } else {
            navToConcept = concept.parent
          }
          break
        }

        case 'ArrowRight':
          if (event.altKey && event.ctrlKey) {
            expandConcept(concept, Expand.DESCENDANTS)
          } else {
            expandConcept(concept, Expand.ON)
          }
          break
        default:
          break
      }

      if (navToConcept) {
        selectConcept(navToConcept.name)
        setAutoExpand({ expand: false, name: navToConcept.name })
      }
    },
    [isExpanded, concept, expandConcept, setAutoExpand, selectConcept]
  )
}

export default useArrowNavigation
