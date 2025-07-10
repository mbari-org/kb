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
      if (event.key === 'Enter' && filteredOptions.length === 1) {
        event.preventDefault()
        const singleOption = filteredOptions[0]
        handleLinkNameSelect(event, singleOption)
        // Blur current input first, then focus linkValue
        event.target.blur()
        setTimeout(() => {
          focusLinkValue?.()
        }, 0)
      }
    },
    [filteredOptions, handleLinkNameSelect, focusLinkValue]
  )

  return {
    handleLinkNameSelect,
    handleLinkNameInputChange,
    handleLinkValueChange,
    handleKeyDown,
  }
}

export default useRealizationFormHandlers
