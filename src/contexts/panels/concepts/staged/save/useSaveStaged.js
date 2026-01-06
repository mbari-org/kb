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

import CONFIG from '@/text'

const { PROCESSING } = CONFIG

const useSaveStaged = () => {
  const { initialState, setConcept, stagedState } = use(ConceptContext)
  const { closeModal, withProcessing } = use(ConceptModalContext)
  const { updateSelected } = use(SelectedContext)
  const { conceptEditsRefresh } = use(TaxonomyContext)

  const updatesContext = useUpdatesContext()

  return useCallback(() => {
    return withProcessing(
      async () => {
        const updatesInfo = await submitStaged(
          updatesContext.apiFns.apiPayload,
          updatesContext.staleConcept,
          initialState,
          stagedState
        )

        const freshConcept = await applyResults(updatesContext, updatesInfo)

        if (updatesInfo.hasUpdated(CONCEPT.FIELD.NAME)) {
          await applyRenameSideEffects(updatesContext, updatesInfo)
        }

        const { concept: updatedConcept } = await conceptEditsRefresh(
          freshConcept,
          updatesContext.staleConcept
        )

        await setConcept(updatedConcept)

        updateSelected({ concept: updatedConcept.name })

        closeModal()
      },
      PROCESSING.SAVE,
      PROCESSING.ARG.CONCEPT
    )
  }, [
    closeModal,
    conceptEditsRefresh,
    initialState,
    setConcept,
    stagedState,
    updateSelected,
    updatesContext,
    withProcessing,
  ])
}

export default useSaveStaged
