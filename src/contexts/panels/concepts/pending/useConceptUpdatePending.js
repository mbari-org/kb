import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import processPendingApproval from '@/lib/concept/pending/processPendingApproval'
import { PENDING } from '@/lib/constants/pending.js'

import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG

const useConceptUpdatePending = () => {
  const { concept: staleConcept, pending, resetConceptPaths, setConcept } = use(ConceptContext)
  const { withProcessing } = use(ConceptModalContext)
  const { apiFns } = use(ConfigContext)
  const { refreshData, reloadConceptRealizations } = use(PanelDataContext)
  const { concepts: conceptSelection, updateSelected } = use(SelectedContext)
  const { conceptEditsRefresh, getConcept, loadConcept } = use(TaxonomyContext)

  return useCallback(
    async pendingConfirm => {
      const { approval, pendingIds } = pendingConfirm

      const pendingConcept = pending(PENDING.DATA.CONCEPT)
      const pendingParent = pending(PENDING.DATA.PARENT)

      const pendingItems = pendingIds.map(pendingId =>
        [...pendingConcept, ...pendingParent].find(item => item.id === pendingId)
      )

      return withProcessing(
        async () => {
          const { concepts, pendingHistory, updated } = await processPendingApproval({
            approval,
            deps: {
              apiFns,
              conceptEditsRefresh,
              getConcept,
              loadConcept,
              refreshData,
              reloadConceptRealizations,
              removeSelectedConceptName: conceptSelection.removeName,
              resetConceptPaths,
              updateSelected,
            },
            items: pendingItems,
          })

          const conceptName = staleConcept.name
          const optimisticConcept = concepts?.[conceptName]

          if (optimisticConcept) {
            await setConcept(optimisticConcept, pendingHistory)
          } else if (updated.includes(conceptName)) {
            const refreshedConcept = getConcept(conceptName)
            if (refreshedConcept) {
              await setConcept(refreshedConcept, pendingHistory)
            }
          } else if (!getConcept(conceptName)) {
            updateSelected({ concept: staleConcept.parent })
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
      conceptSelection,
      getConcept,
      loadConcept,
      pending,
      refreshData,
      reloadConceptRealizations,
      resetConceptPaths,
      setConcept,
      staleConcept,
      updateSelected,
      withProcessing,
    ]
  )
}

export default useConceptUpdatePending
