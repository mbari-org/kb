import SelectedContext from '@/contexts/selected/SelectedContext'
import { use } from 'react'

const useConceptSelect = setAutoExpand => {
  const { select } = use(SelectedContext)

  const handleConceptSelect = (_event, selectedName) => {
    if (selectedName) {
      setAutoExpand?.({ expand: true, name: selectedName })
      select({ concept: selectedName })
    }
  }

  const handleKeyUp = (event, taxonomyNames) => {
    if (event.key === 'Enter') {
      const conceptName = event.target.value.trim()
      if (taxonomyNames.includes(conceptName)) {
        setAutoExpand?.({ expand: true, name: conceptName })
        select({ concept: conceptName })
        document.activeElement.blur()
      }
    }
  }

  return {
    handleConceptSelect,
    handleKeyUp,
  }
}

export default useConceptSelect
