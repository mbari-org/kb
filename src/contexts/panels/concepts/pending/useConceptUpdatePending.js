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
      const { approval, pendingIds } = pendingConfirm

      const pendingConcept = pending(PENDING.DATA.CONCEPT)

      const pendingItems = pendingIds.map(pendingId => pendingConcept.find(item => item.id === pendingId))

      return withProcessing(
        async () => {
          const { concepts, updated } = await processPendingApproval({
            approval,
            deps: {
              apiFns,
              conceptEditsRefresh,
              getConcept,
              refreshData,
              updateSelected,
            },
            items: pendingItems,
          })

          const conceptName = staleConcept.name
          const optimisticConcept = concepts?.[conceptName]

          if (optimisticConcept) {
            await setConcept(optimisticConcept)
          } else if (updated.includes(conceptName)) {
            const refreshedConcept = getConcept(conceptName)
            if (refreshedConcept) {
              await setConcept(refreshedConcept)
            }
          }

          return pendingConcept.length !== pendingItems.length
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
