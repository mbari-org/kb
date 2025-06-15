import { use } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import SelectedContext from '@/contexts/selected/SelectedContext'

const useLoadConceptError = () => {
  const { showBoundary } = useErrorBoundary()

  const { concepts } = use(SelectedContext)

  return error => {
    // CxNote error.conceptName failed to load, so we remove it from the concepts store; however,
    // the removal may result in sequential duplicates, which we remove as well.

    const conceptName = error.conceptName
    const currentConcepts = concepts.getState()

    const newState = currentConcepts.reduce((acc, concept) => {
      // skip conceptName entries
      if (concept === conceptName) return acc
      // skip sequential duplicate entry
      if (acc.length > 0 && acc[acc.length - 1] === concept) return acc
      return [...acc, concept]
    }, [])

    concepts.clear()
    newState.forEach(concept => concepts.push(concept))

    const info = `Concept ${conceptName} failed to load and will be removed from the current Concepts stack`

    showBoundary({ ...error, info })
  }
}

export default useLoadConceptError
