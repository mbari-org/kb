import { useCallback } from 'react'

import { EMPTY_TEMPLATE } from '@/lib/kb/model/template'

const useRealizationFormHandlers = ({
  realizationItem,
  onRealizationChange,
  allAvailableTemplates,
  filteredOptions,
  focusLinkValue,
}) => {
  const handleLinkNameSelect = useCallback(
    (_event, newValue) => {
      if (newValue) {
        // first template wins
        const selectedTemplate = allAvailableTemplates.find(
          template => template.linkName === newValue
        )

        const updatedRealizationItem = {
          ...realizationItem,
          linkName: newValue,
          toConcept: selectedTemplate?.toConcept || realizationItem.toConcept,
          linkValue: selectedTemplate?.linkValue || realizationItem.linkValue,
          templateId: selectedTemplate?.id,
        }

        onRealizationChange(updatedRealizationItem, 'linkName')
      } else {
        const updatedRealizationItem = {
          ...realizationItem,
          ...EMPTY_TEMPLATE,
          templateId: null,
        }

        onRealizationChange(updatedRealizationItem, 'linkName')
      }
    },
    [realizationItem, onRealizationChange, allAvailableTemplates]
  )

  const handleLinkNameInputChange = useCallback(
    (_event, newInputValue) => {
      const updatedRealizationItem = {
        ...realizationItem,
        linkName: newInputValue,
      }
      onRealizationChange(updatedRealizationItem, 'linkName')
    },
    [realizationItem, onRealizationChange]
  )

  const handleLinkValueChange = useCallback(
    event => {
      const { name: field, value } = event.target
      const updatedRealizationItem = {
        ...realizationItem,
        [field]: value,
      }
      onRealizationChange(updatedRealizationItem, field)
    },
    [realizationItem, onRealizationChange]
  )

  const handleKeyDown = useCallback(
    event => {
      if (event.key === 'Enter') {
        const currentInput = realizationItem.linkName || ''
        
        // Check if current input exactly matches an available template linkName
        const exactMatch = allAvailableTemplates.find(
          template => template.linkName === currentInput
        )
        
        // Check if there's only one filtered option
        const singleFilteredOption = filteredOptions.length === 1 ? filteredOptions[0] : null
        
        if (exactMatch || singleFilteredOption) {
          event.preventDefault()
          const selectedOption = exactMatch ? currentInput : singleFilteredOption
          handleLinkNameSelect(event, selectedOption)
          // Blur current input first, then focus linkValue
          event.target.blur()
          setTimeout(() => {
            focusLinkValue?.()
          }, 0)
        }
      }
    },
    [realizationItem.linkName, allAvailableTemplates, filteredOptions, handleLinkNameSelect, focusLinkValue]
  )

  const handleLinkValueKeyDown = useCallback(
    event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        
        // Find all templates that match the current linkName
        const matchingTemplates = allAvailableTemplates.filter(
          template => template.linkName === realizationItem.linkName
        )
        
        // Only cycle if there are multiple matching templates AND current form exactly matches a template
        if (matchingTemplates.length > 1) {
          // Find the current template index (must be exact match)
          const currentIndex = matchingTemplates.findIndex(template => 
            template.toConcept === realizationItem.toConcept && 
            template.linkValue === realizationItem.linkValue
          )
          
          // Only cycle if current form exactly matches an existing template
          if (currentIndex >= 0) {
            // Get the next template (cycle to 0 if at end)
            const nextIndex = (currentIndex + 1) % matchingTemplates.length
            const nextTemplate = matchingTemplates[nextIndex]
            
            const updatedRealizationItem = {
              ...realizationItem,
              toConcept: nextTemplate.toConcept,
              linkValue: nextTemplate.linkValue,
              templateId: nextTemplate.id,
            }
            
            onRealizationChange(updatedRealizationItem, 'linkValue')
          }
          // If currentIndex is -1 (no exact match), do nothing - let the user's input stand
        }
      }
    },
    [realizationItem, onRealizationChange, allAvailableTemplates]
  )

  return {
    handleLinkNameSelect,
    handleLinkNameInputChange,
    handleLinkValueChange,
    handleKeyDown,
    handleLinkValueKeyDown,
  }
}

export default useRealizationFormHandlers
