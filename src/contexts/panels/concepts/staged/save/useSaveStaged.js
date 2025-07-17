import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import submitStaged from './submitStaged'

const useSaveStaged = () => {
  const { apiFns } = use(ConfigContext)
  const { closeModal, setProcessing } = use(ConceptModalContext)
  const { concept, initialState, resetConcept, stagedState } = use(ConceptContext)
  const { updateSelected } = use(SelectedContext)
  const { refreshConcept, renameConcept } = use(TaxonomyContext)

  return useCallback(async () => {
    setProcessing('Saving concept...')

    const updatesInfo = await submitStaged(apiFns.apiPayload, concept, initialState, stagedState)
    const { hasUpdated } = updatesInfo

    let updatedConcept
    if (hasUpdated('name')) {
      const { concept: renamedConcept } = await renameConcept(concept, updatesInfo)
      updatedConcept = renamedConcept
    } else {
      const { concept: refreshedConcept } = await refreshConcept(concept, updatesInfo)
      updatedConcept = refreshedConcept
    }

    resetConcept(updatedConcept)

    updateSelected({ concept: updatedConcept.name })

    closeModal()

    setProcessing(false)
  }, [
    apiFns.apiPayload,
    closeModal,
    concept,
    initialState,
    refreshConcept,
    renameConcept,
    resetConcept,
    setProcessing,
    stagedState,
    updateSelected,
  ])
}

export default useSaveStaged
