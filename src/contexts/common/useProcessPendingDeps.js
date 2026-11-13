import { use, useMemo } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const useProcessPendingDeps = () => {
  const { apiFns } = use(ConfigContext)
  const { getReferences, refreshData, reloadConceptRealizations } = use(PanelDataContext)
  const { resetConceptPaths } = use(ConceptContext)
  const { concepts: conceptSelection, updateSelected } = use(SelectedContext)
  const { conceptEditsRefresh, getConcept, loadConcept } = use(TaxonomyContext)

  return useMemo(
    () => ({
      apiFns,
      conceptEditsRefresh,
      getConcept,
      getReferences,
      loadConcept,
      refreshData,
      reloadConceptRealizations,
      removeSelectedConceptName: conceptSelection.removeName,
      resetConceptPaths,
      updateSelected,
    }),
    [
      apiFns,
      conceptEditsRefresh,
      conceptSelection,
      getConcept,
      getReferences,
      loadConcept,
      refreshData,
      reloadConceptRealizations,
      resetConceptPaths,
      updateSelected,
    ]
  )
}

export default useProcessPendingDeps
