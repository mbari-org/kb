import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import processPendingApproval from '@/lib/concept/pending/processPendingApproval'
import { PENDING } from '@/lib/constants/pending.js'

import CONFIG from '@/text'

const { PROCESSING } = CONFIG

const useConceptUpdatePending = () => {
  const { concept: staleConcept, pending, setConcept } = use(ConceptContext)
  const { withProcessing } = use(ConceptModalContext)
  const { apiFns } = use(ConfigContext)
  const { refreshData } = use(PanelDataContext)
  const { updateSelected } = use(SelectedContext)
  const { conceptEditsRefresh, getConcept } = use(TaxonomyContext)

  return useCallback(
    async pendingConfirm => {
      const { approval, pendingIds: propIds, pendingItems: propItems } = pendingConfirm

      const pendingConcept = pending(PENDING.DATA.CONCEPT)

      // Standardize on pendingIds - convert to items for processing
      // Backward compatibility: support pendingItems if provided, but prefer pendingIds
      const items = propItems
        ? propItems
        : (propIds || []).map(pendingId => pendingConcept.find(item => item.id === pendingId)).filter(Boolean)

      return withProcessing(
        async () => {
          const { updated } = await processPendingApproval({
            approval,
            deps: {
              apiFns,
              conceptEditsRefresh,
              getConcept,
              refreshData,
              updateSelected,
            },
            items,
          })

          if (updated.includes(staleConcept.name)) {
            const { concept: updatedConcept } = await conceptEditsRefresh(
              getConcept(staleConcept.name),
              staleConcept
            )
            await setConcept(updatedConcept)
          }

          return pendingConcept.length !== items.length
        },
        PROCESSING.UPDATE,
        `${PROCESSING.ARG.PENDING}: ${approval}`
      )
    },
    [
      apiFns,
      conceptEditsRefresh,
      getConcept,
      pending,
      refreshData,
      setConcept,
      staleConcept,
      updateSelected,
      withProcessing,
    ]
  )
}

export default useConceptUpdatePending
