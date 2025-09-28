import { use, useCallback } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import { createConceptError } from '@/lib/errors'
import SelectedContext from '@/contexts/selected/SelectedContext'

const useLoadConceptError = () => {
  const { showBoundary } = useErrorBoundary()
  const { concepts } = use(SelectedContext)

  return useCallback(
    error => {
      const conceptName = error.conceptName
      const currentConcepts = concepts.getState()

      // Remove failed concept and dedup
      const newState = currentConcepts.reduce((acc, concept) => {
        if (concept === conceptName ||
            (acc.length > 0 && acc[acc.length - 1] === concept)) {
          return acc
        }
        return [...acc, concept]
      }, [])

      concepts.clear()
      newState.forEach(concept => concepts.push(concept))

      const message = error.message || 'Failed to load concept'
      const conceptError = createConceptError(
        conceptName,
        message,
        error.original
      )

      showBoundary(conceptError)
    },
    [concepts, showBoundary]
  )
}

export default useLoadConceptError
