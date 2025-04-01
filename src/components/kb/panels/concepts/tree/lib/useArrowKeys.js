import { useCallback, useEffect } from 'react'

import useArrowNavigation from './useArrowNavigation'

const useArrowKeys = (
  concept,
  expandConcept,
  expandedItems,
  getConcept,
  selectConcept,
  setAutoExpand,
  sidebarRef
) => {
  const isExpanded = useCallback(
    concept => {
      return 0 < concept.children.length && expandedItems.includes(concept.name)
    },
    [expandedItems]
  )

  const handleArrowKeys = useArrowNavigation(
    concept,
    expandConcept,
    getConcept,
    isExpanded,
    selectConcept,
    setAutoExpand
  )

  useEffect(() => {
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    const handleKeyDown = event => {
      if (arrowKeys.includes(event.key)) {
        event.preventDefault()
        handleArrowKeys(event)
      }
    }
    const currentSidebar = sidebarRef.current
    if (currentSidebar) {
      currentSidebar.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (currentSidebar) {
        currentSidebar.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [handleArrowKeys, sidebarRef])
}

export default useArrowKeys
