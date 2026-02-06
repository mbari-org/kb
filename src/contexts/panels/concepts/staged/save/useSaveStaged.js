import { use, useCallback } from 'react'

import { getConcept, normalizeConcept } from '@/lib/api/concept'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import applyRenameSideEffects from '@/contexts/panels/concepts/staged/save/applyRenameSideEffects'
import applyUpdateResults from '@/contexts/panels/concepts/staged/save/applyUpdateResults'
import submitStaged from '@/contexts/panels/concepts/staged/save/submitStaged'
import useUpdatesContext from '@/contexts/panels/concepts/staged/save/useUpdatesContext'

import { isAdmin } from '@/lib/auth/role'

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
        const { apiFns, staleConcept, user } = updatesContext

        const updatesInfo = await submitStaged(
          initialState,
          stagedState,
          updatesContext
        )

        const conceptName =
          updatesInfo?.updatedValue(CONCEPT.FIELD.NAME)?.value || staleConcept.name

        const freshConcept = await apiFns.apiPayload(getConcept, conceptName)
        await normalizeConcept(apiFns, freshConcept)

        await applyUpdateResults({
          freshConcept,
          isAdmin: isAdmin(user),
          staleConcept,
          updatesInfo })

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
