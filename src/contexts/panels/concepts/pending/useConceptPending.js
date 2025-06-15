import { use, useMemo } from 'react'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const useConceptPending = conceptName => {
  const { getPendingHistory } = use(TaxonomyContext)

  const conceptPending = useMemo(
    () => getPendingHistory(conceptName),
    [conceptName, getPendingHistory]
  )

  return conceptPending
}

export default useConceptPending
