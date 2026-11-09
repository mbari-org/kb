import { use, useCallback } from 'react'

import { getConcept, normalizeConcept } from '@/lib/api/concept'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
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
  const { initialState, relabelConceptPaths, resetConceptPaths, setConcept, setEditing } = use(ConceptContext)
  const { stagedState } = use(ConceptStagedContext)
  const { closeModal, withProcessing } = use(ConceptModalContext)
  const { updateSelected } = use(SelectedContext)
  const { conceptEditsRefresh } = use(TaxonomyContext)

  const updatesContext = useUpdatesContext()

  return useCallback(() => {
    return withProcessing(
      async () => {
        const { apiFns, isAdmin, refreshPanelData, reloadConceptRealizations, staleConcept } = updatesContext

        const updatesInfo = await submitStaged(initialState, stagedState, updatesContext)

        const conceptName = updatesInfo?.updatedValue(CONCEPT.FIELD.NAME)?.value || staleConcept.name

        const nameUpdated = updatesInfo.hasUpdated(CONCEPT.FIELD.NAME)
        const isPureRename =
          nameUpdated &&
          ![
            CONCEPT.FIELD.ALIASES,
            CONCEPT.FIELD.AUTHOR,
            CONCEPT.FIELD.CHILDREN,
            CONCEPT.FIELD.MEDIA,
            CONCEPT.FIELD.PARENT,
            CONCEPT.FIELD.RANK,
            CONCEPT.FIELD.REALIZATIONS,
          ].some(field => updatesInfo.hasUpdated(field))

        if (nameUpdated) {
          await applyRenameSideEffects(updatesContext, updatesInfo)
        }

        if (updatesInfo.hasUpdated(CONCEPT.FIELD.PARENT)) {
          resetConceptPaths()
        } else if (nameUpdated) {
          relabelConceptPaths(staleConcept.name, conceptName)
        }

        if (updatesInfo.hasUpdated(CONCEPT.FIELD.REALIZATIONS)) {
          await reloadConceptRealizations(conceptName)
        }

        let freshConcept
        if (isPureRename) {
          // Strip UI-attached fields (added by ConceptProvider.handleSetConcept); they are not taxonomy state.
          freshConcept = { ...staleConcept, name: conceptName }
          delete freshConcept.realizations
          delete freshConcept.templates
          if (freshConcept.media === undefined) {
            await normalizeConcept(apiFns, freshConcept)
          }
        } else {
          freshConcept = await apiFns.apiPayload(getConcept, conceptName)
          await normalizeConcept(apiFns, freshConcept)
        }

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
    relabelConceptPaths,
    resetConceptPaths,
    setConcept,
    setEditing,
    stagedState,
    updateSelected,
    updatesContext,
    withProcessing,
  ])
}

export default useSaveStaged
