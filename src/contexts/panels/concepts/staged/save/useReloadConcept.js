import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import remapConceptName from '@/contexts/panels/concepts/staged/save/remapConceptName'
import useUpdatesContext from '@/contexts/panels/concepts/staged/save/useUpdatesContext'

import enqueueConceptMutation from '@/lib/concept/enqueueConceptMutation'
import { loadConceptById } from '@/lib/model/concept'
import { PANEL_DATA } from '@/lib/constants/panelData.js'

import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG

const useReloadConcept = () => {
  const { relabelConceptPaths, resetConceptPaths, setConcept, setEditing } = use(ConceptContext)
  const { closeModal, withProcessing } = use(ConceptModalContext)
  const { updateSelected } = use(SelectedContext)
  const { conceptEditsRefresh, isRoot } = use(TaxonomyContext)

  const updatesContext = useUpdatesContext()

  return useCallback(() => {
    return withProcessing(
      () =>
        enqueueConceptMutation(async () => {
          const { apiFns, refreshPanelData, reloadConceptRealizations, staleConcept } = updatesContext

          const freshConcept = await loadConceptById(apiFns, staleConcept, isRoot(staleConcept))
          const nameChanged = freshConcept.name !== staleConcept.name
          const parentChanged = freshConcept.parent !== staleConcept.parent

          if (nameChanged) {
            await remapConceptName(updatesContext, freshConcept.name)
          }

          if (parentChanged) {
            resetConceptPaths()
          } else if (nameChanged) {
            relabelConceptPaths(staleConcept.name, freshConcept.name)
          }

          await reloadConceptRealizations(freshConcept.name)
          await refreshPanelData(PANEL_DATA.TEMPLATES)
          const { pendingHistory } = await refreshPanelData(PANEL_DATA.PENDING_HISTORY)

          const { concept: updatedConcept } = await conceptEditsRefresh(freshConcept, staleConcept)

          await setConcept(updatedConcept, pendingHistory)
          setEditing(false)
          updateSelected({ concept: updatedConcept.name })
          closeModal(true)
        }),
      PROCESSING.LOAD,
      PROCESSING.ARG.CONCEPT
    )
  }, [
    closeModal,
    conceptEditsRefresh,
    isRoot,
    relabelConceptPaths,
    resetConceptPaths,
    setConcept,
    setEditing,
    updateSelected,
    updatesContext,
    withProcessing,
  ])
}

export default useReloadConcept
