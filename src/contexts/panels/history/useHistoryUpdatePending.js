import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import processPendingApproval from '@/lib/concept/pending/processPendingApproval'

const useHistoryUpdatePending = () => {
  const { apiFns } = use(ConfigContext)
  const { refreshData, reloadConceptRealizations } = use(PanelDataContext)
  const { resetConceptPaths } = use(ConceptContext)
  const { conceptEditsRefresh, getConcept, loadConcept } = use(TaxonomyContext)
  const { updateSelected } = use(SelectedContext)

  return useCallback(
    async ({ approval, item }) => {
      await processPendingApproval({
        approval,
        deps: {
          apiFns,
          conceptEditsRefresh,
          getConcept,
          loadConcept,
          refreshData,
          reloadConceptRealizations,
          resetConceptPaths,
          updateSelected,
        },
        items: [item],
      })

      return true
    },
    [apiFns, conceptEditsRefresh, getConcept, loadConcept, refreshData, reloadConceptRealizations, resetConceptPaths, updateSelected]
  )
}

export default useHistoryUpdatePending
