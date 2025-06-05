import { use, useState } from 'react'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import createConceptStore from '@/lib/store/concepts'

const useSelectedConcept = () => {
  const { getRoot } = use(TaxonomyContext)

  const conceptStore = createConceptStore(getRoot().name)

  const [currentConcept, setCurrentConcept] = useState(conceptStore.current())

  return {
    ...conceptStore,

    back: () => {
      const result = conceptStore.back()
      setCurrentConcept(conceptStore.current())
      return result
    },

    current: () => currentConcept,

    forward: () => {
      const result = conceptStore.forward()
      setCurrentConcept(conceptStore.current())
      return result
    },

    push: concept => {
      conceptStore.push(concept)
      setCurrentConcept(concept)
    },
  }
}

export default useSelectedConcept
