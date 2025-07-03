import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import commitStaged from './commitStaged'

const useSaveStaged = () => {
  const { apiFns } = use(ConfigContext)
  const { closeModal, setProcessing } = use(ConceptModalContext)
  const { concept, initialState, refreshConcept, stagedState } = use(ConceptContext)
  const { refreshConcept: refreshTaxonomyConcept } = use(TaxonomyContext)

  return useCallback(async () => {
    closeModal()

    setProcessing('Saving concept...')

    const updateInfo = await commitStaged(apiFns.apiPayload, concept, initialState, stagedState)
    const updatedConcept = await refreshTaxonomyConcept(concept, updateInfo)
    refreshConcept(updatedConcept)

    setProcessing(false)
  }, [
    apiFns.apiPayload,
    closeModal,
    concept,
    initialState,
    refreshConcept,
    refreshTaxonomyConcept,
    setProcessing,
    stagedState,
  ])
}

export default useSaveStaged
