import { getNextSibling, getPrevSibling } from "@/model/taxonomy"

// const debounce = (func, wait) => {
//   let timeout
//   return function executedFunction(...args) {
//     const later = () => {
//       clearTimeout(timeout)
//       func(...args)
//     }
//     clearTimeout(timeout)
//     timeout = setTimeout(later, wait)
//   }
// }

const handleArrowNav = (
  concept,
  event,
  expandAllChildren,
  expandConcept,
  expandedItems,
  selectConcept,
  setAutoExpand
) => {
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
          prevConcept = prevConcept.children[prevConcept.children.length - 1]
        }
        navToConcept = prevConcept
      } else {
        navToConcept = concept.parent
      }
      break

    case "ArrowLeft":
      if (isExpanded(concept)) {
        if (event.altKey && event.ctrlKey) {
          expandAllChildren(concept, false)
        } else {
          expandConcept(concept, false)
        }
      } else {
        navToConcept = concept.parent
      }
      break

    case "ArrowRight":
      if (event.altKey && event.ctrlKey) {
        expandAllChildren(concept, true)
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
}

const handleSelectConcept = (
  concept,
  expandConcept,
  expandedItems,
  itemId,
  selectConcept,
  setAutoExpand
) => {
  if (itemId === concept.name) {
    expandConcept(concept, !expandedItems.includes(concept.name))
  } else {
    setAutoExpand(true)
    selectConcept(itemId)
  }
}

export { handleArrowNav, handleSelectConcept }
