import { use } from 'react'

import { createStagedActions } from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_STATE, SELECTED } from '@/lib/constants'

const DeleteConceptActions = () => {
  const { concept, modifyConcept, setEditing } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)
  const { updateSelected } = use(SelectedContext)
  const { deleteConcept } = use(TaxonomyContext)

  const handleCancel = () => {
    modifyConcept({
      type: CONCEPT_STATE.CONCEPT.DELETE_CONCEPT,
      update: { delete: false },
    })
    closeModal()
  }

  const handleStage = () => {
    modifyConcept({
      type: CONCEPT_STATE.CONCEPT.DELETE_CONCEPT,
      update: { delete: true },
    })
    closeModal(true)
    deleteConcept(concept).then(selectConcept => {
      updateSelected({ [SELECTED.CONCEPT]: selectConcept.name })
      setEditing(false)
    })
  }

  return createStagedActions({
    onDiscard: handleCancel,
    onStage: handleStage,
    stageDisabled: !modalData?.isValid,
    confirmReset: false,
    name: 'DeleteConceptActions',
  })
}

export default DeleteConceptActions
