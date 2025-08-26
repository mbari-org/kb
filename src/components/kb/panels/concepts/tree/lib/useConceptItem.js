import { use, useCallback } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { pendingChild } from '@/lib/kb/model/history'

/**
 * Hook for creating concept items for tree display
 * Migrated from taxonomyItem.js to use PanelDataContext for history
 */
const useConceptItem = () => {
  const { pendingHistory } = use(PanelDataContext)
  const { getConcept } = use(TaxonomyContext)

  const createConceptItem = useCallback(
    (taxonomy, itemId) => {
      const concept = getConcept(itemId)
      if (!concept) return null

      const pendingConcept = pendingHistory.filter(history => history.concept === concept.name)
      const pendingParent = pendingHistory.filter(history => history.concept === concept.parent)
      const hasPending = 0 < pendingConcept.length || !!pendingChild(pendingParent, concept.name)

      return {
        id: concept.name,
        label:
          concept.alternateNames.length === 0
            ? concept.name
            : `${concept.name} (${concept.alternateNames.join(', ')})`,
        hasPending,
        mediaCount: concept.media?.length || 0,
        parent: concept.parent,
      }
    },
    [getConcept, pendingHistory]
  )

  return createConceptItem
}

export default useConceptItem
