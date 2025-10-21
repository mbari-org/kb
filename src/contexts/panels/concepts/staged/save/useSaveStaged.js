import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import applyResults from '@/contexts/panels/concepts/staged/save/applyResults'
import applySideEffects from '@/contexts/panels/concepts/staged/save/applySideEffects'
import submitStaged from '@/contexts/panels/concepts/staged/save/submitStaged'
import useUpdatesContext from '@/contexts/panels/concepts/staged/save/useUpdatesContext'

const useSaveStaged = () => {
  const { closeModal, setProcessing } = use(ConceptModalContext)
  const { initialState, setConcept, stagedState } = use(ConceptContext)
  const { updateSelected } = use(SelectedContext)
  const { refreshConcept } = use(TaxonomyContext)

  const updatesContext = useUpdatesContext()

  return useCallback(async () => {
    setProcessing('Saving concept...')

    let updatesInfo
    try {
      updatesInfo = await submitStaged(
        updatesContext.apiFns.apiPayload,
        updatesContext.staleConcept,
        initialState,
        stagedState
      )
    } catch (error) {
      setProcessing(false)
      throw error
    }

    const freshConcept = await applyResults(updatesContext, updatesInfo)

    await applySideEffects(updatesContext, updatesInfo)

    const { concept: updatedConcept } = await refreshConcept(freshConcept, updatesContext.staleConcept)

    await setConcept(updatedConcept)

    updateSelected({ concept: updatedConcept.name })

    closeModal()

    setProcessing(false)
  }, [
    closeModal,
    initialState,
    updatesContext,
    refreshConcept,
    setConcept,
    setProcessing,
    stagedState,
    updateSelected,
  ])
}

export default useSaveStaged
