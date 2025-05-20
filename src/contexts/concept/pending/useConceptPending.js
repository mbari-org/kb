import { use, useMemo } from 'react'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const useConceptPending = concept => {
  const { getPendingHistory } = use(TaxonomyContext)

  const conceptPending = useMemo(
    () => getPendingHistory(concept.name),
    [concept.name, getPendingHistory]
  )

  return conceptPending
}

export default useConceptPending
