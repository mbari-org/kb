import { useCallback } from "react"

const useSelectConcept = (
  concept,
  expandConcept,
  expandedItems,
  selectConcept,
  setAutoExpand
) => {
  const handleSelectConcept = useCallback(
    itemId => {
      if (itemId === concept.name) {
        expandConcept(concept, !expandedItems.includes(concept.name))
      } else {
        setAutoExpand(true)
        selectConcept(itemId)
      }
    },
    [concept, expandConcept, expandedItems, selectConcept, setAutoExpand]
  )

  return handleSelectConcept
}

export default useSelectConcept
