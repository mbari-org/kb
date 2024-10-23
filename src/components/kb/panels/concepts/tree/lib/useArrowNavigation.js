import { getNextSibling, getPrevSibling } from "@/model/taxonomy"
import { useCallback } from "react"

import useExpandDescendants from "./useExpandDescendants"

const useArrowNavigation = (
  concept,
  expandConcept,
  expandedItems,
  selectConcept,
  setAutoExpand,
  setExpandedItems,
  taxonomy
) => {
  const expandDescendants = useExpandDescendants(setExpandedItems, taxonomy)

  const handleArrowNav = useCallback(
    event => {
      const isExpanded = concept =>
        0 < concept.children.length && expandedItems.includes(concept.name)

      let navToConcept
      switch (event.key) {
        case "ArrowDown":
          if (isExpanded(concept)) {
            navToConcept = concept.children[0]
            break
          }

          const nextSibling = getNextSibling(concept)
          if (!isExpanded(concept) && nextSibling) {
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

        case "ArrowUp":
          const prevSibling = getPrevSibling(concept)
          if (prevSibling) {
            let prevConcept = prevSibling
            while (isExpanded(prevConcept)) {
              prevConcept =
                prevConcept.children[prevConcept.children.length - 1]
            }
            navToConcept = prevConcept
          } else {
            navToConcept = concept.parent
          }
          break

        case "ArrowLeft":
          if (isExpanded(concept)) {
            if (event.altKey && event.ctrlKey) {
              expandDescendants(concept, false)
            } else {
              expandConcept(concept, false)
            }
          } else {
            navToConcept = concept.parent
          }
          break

        case "ArrowRight":
          if (event.altKey && event.ctrlKey) {
            expandDescendants(concept, true)
          } else {
            expandConcept(concept, true)
          }
          break
        default:
          break
      }

      if (navToConcept) {
        setAutoExpand(false)
        selectConcept(navToConcept.name)
      }
    },
    [
      concept,
      expandDescendants,
      expandConcept,
      expandedItems,
      selectConcept,
      setAutoExpand,
    ]
  )

  return handleArrowNav
}

export default useArrowNavigation
