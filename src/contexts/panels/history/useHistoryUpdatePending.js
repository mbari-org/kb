import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import processPendingApproval from '@/lib/concept/pending/processPendingApproval'
import { PENDING } from '@/lib/constants/pending.js'
import { isPendingDelete } from '@/lib/model/history'

const useHistoryUpdatePending = () => {
  const { apiFns } = use(ConfigContext)
  const { pendingHistory, refreshData, reloadConceptRealizations } = use(PanelDataContext)
  const { resetConceptPaths } = use(ConceptContext)
  const { conceptEditsRefresh, getConcept, loadConcept } = use(TaxonomyContext)
  const { concepts: conceptSelection, updateSelected } = use(SelectedContext)

  return useCallback(
    async ({ approval, item }) => {
      const deps = {
        apiFns,
        conceptEditsRefresh,
        getConcept,
        loadConcept,
        refreshData,
        reloadConceptRealizations,
        removeSelectedConceptName: conceptSelection.removeName,
        resetConceptPaths,
        updateSelected,
      }

      if (approval === PENDING.APPROVAL.ACCEPT && isPendingDelete(item)) {
        const otherPending = pendingHistory.filter(pendingItem => pendingItem.concept === item.oldValue)
        if (otherPending.length > 0) {
          await processPendingApproval({ approval: PENDING.APPROVAL.REJECT, deps, items: otherPending })
        }
      }

      await processPendingApproval({ approval, deps, items: [item] })

      return true
    },
    [
      apiFns,
      conceptEditsRefresh,
      conceptSelection,
      getConcept,
      loadConcept,
      pendingHistory,
      refreshData,
      reloadConceptRealizations,
      resetConceptPaths,
      updateSelected,
    ]
  )
}

export default useHistoryUpdatePending
