import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import applyRenameSideEffects from '@/contexts/panels/concepts/staged/save/applyRenameSideEffects'
import applyResults from '@/contexts/panels/concepts/staged/save/applyResults'
import submitStaged from '@/contexts/panels/concepts/staged/save/submitStaged'
import useUpdatesContext from '@/contexts/panels/concepts/staged/save/useUpdatesContext'

import { CONCEPT } from '@/lib/constants'

const useSaveStaged = () => {
  const { initialState, setConcept, stagedState } = use(ConceptContext)
  const { closeModal, setProcessing } = use(ConceptModalContext)
  const { updateSelected } = use(SelectedContext)
  const { conceptEditsRefresh } = use(TaxonomyContext)

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

    if (updatesInfo.hasUpdated(CONCEPT.FIELD.NAME)) {
      await applyRenameSideEffects(updatesContext, updatesInfo)
    }

    const { concept: updatedConcept } = await conceptEditsRefresh(freshConcept, updatesContext.staleConcept)

    await setConcept(updatedConcept)

    updateSelected({ concept: updatedConcept.name })

    closeModal()

    setProcessing(false)
  }, [
    closeModal,
    conceptEditsRefresh,
    initialState,
    setConcept,
    setProcessing,
    stagedState,
    updateSelected,
    updatesContext,
  ])
}

export default useSaveStaged
