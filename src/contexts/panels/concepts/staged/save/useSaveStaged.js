import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import submitStaged from './submitStaged'

const useSaveStaged = () => {
  const { apiFns } = use(ConfigContext)
  const { closeModal, setProcessing } = use(ConceptModalContext)
  const { concept, initialState, refreshConcept, stagedState } = use(ConceptContext)
  const { refreshData: refreshPanelData } = use(PanelDataContext)
  const { refreshConcept: refreshTaxonomyConcept } = use(TaxonomyContext)

  return useCallback(async () => {
    setProcessing('Saving concept...')

    const updatesInfo = await submitStaged(apiFns.apiPayload, concept, initialState, stagedState)
    const { pendingHistory } = await refreshPanelData('pendingHistory')
    const updatedConcept = await refreshTaxonomyConcept(concept, updatesInfo)

    refreshConcept(updatedConcept, pendingHistory)
    closeModal()

    setProcessing(false)
  }, [
    apiFns.apiPayload,
    closeModal,
    concept,
    initialState,
    refreshConcept,
    refreshPanelData,
    refreshTaxonomyConcept,
    setProcessing,
    stagedState,
  ])
}

export default useSaveStaged
