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

import { CONCEPT } from '@/lib/constants'
import { PANEL_DATA } from '@/lib/constants/panelData.js'

import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG

const useSaveStaged = () => {
  const { initialState, setConcept, setEditing, stagedState } = use(ConceptContext)
  const { closeModal, withProcessing } = use(ConceptModalContext)
  const { updateSelected } = use(SelectedContext)
  const { conceptEditsRefresh } = use(TaxonomyContext)

  const updatesContext = useUpdatesContext()

  return useCallback(() => {
    return withProcessing(
      async () => {
        const { apiFns, isAdmin, refreshPanelData, staleConcept } = updatesContext

        const updatesInfo = await submitStaged(initialState, stagedState, updatesContext)

        if (updatesInfo.hasUpdated(CONCEPT.FIELD.NAME)) {
          await applyRenameSideEffects(updatesContext, updatesInfo)
        }

        const conceptName = updatesInfo?.updatedValue(CONCEPT.FIELD.NAME)?.value || staleConcept.name

        const freshConcept = await apiFns.apiPayload(getConcept, conceptName)
        await normalizeConcept(apiFns, freshConcept)

        await applyUpdateResults({
          freshConcept,
          isAdmin,
          staleConcept,
          updatesInfo,
        })

        const { pendingHistory } = await refreshPanelData(PANEL_DATA.PENDING_HISTORY)

        const { concept: updatedConcept } = await conceptEditsRefresh(freshConcept, updatesContext.staleConcept)

        await setConcept(updatedConcept, pendingHistory)
        setEditing(false)

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
    setEditing,
    stagedState,
    updateSelected,
    updatesContext,
    withProcessing,
  ])
}

export default useSaveStaged
