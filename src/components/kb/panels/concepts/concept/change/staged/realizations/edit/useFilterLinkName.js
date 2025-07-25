import { useCallback } from 'react'

const useFilterLinkName = ({
  cycleIndex,
  filterLinkName,
  filteredTemplates,
  onRealizationChange,
  realizationItem,
  setCycleIndex,
}) => {
  const handleFilterKeyDown = useCallback(
    event => {
      if (event.key !== 'Enter') return

      const currentInput = filterLinkName.trim()
      if (currentInput && filteredTemplates.length > 0) {
        event.preventDefault()

        const filteredTemplate = filteredTemplates[cycleIndex]

        if (filteredTemplate) {
          const updatedRealizationItem = {
            ...realizationItem,
            linkName: filteredTemplate.linkName,
            toConcept: filteredTemplate.toConcept,
            linkValue: filteredTemplate.linkValue,
            templateId: filteredTemplate.id,
          }
          onRealizationChange(updatedRealizationItem)

          setCycleIndex(prevIndex => (prevIndex + 1) % filteredTemplates.length)
        }
      }
    },
    [
      cycleIndex,
      filteredTemplates,
      filterLinkName,
      onRealizationChange,
      realizationItem,
      setCycleIndex,
    ]
  )

  return {
    handleFilterKeyDown,
  }
}

export default useFilterLinkName
