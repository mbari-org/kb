import { use } from 'react'

import { createStagedActions } from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { editValue } from '@/lib/kb/state/value'

import { CONCEPT_STATE } from '@/lib/constants'

const DeleteConceptActions = () => {
  const { concept, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  const handleCancel = () => {
    modifyConcept({
      type: CONCEPT_STATE.DELETE,
      update: editValue(concept, { field: 'delete', value: false }),
    })
    closeModal()
  }

  const handleStage = () => {
    modifyConcept({
      type: CONCEPT_STATE.DELETE,
      update: editValue(concept, { field: 'delete', value: true }),
    })
    closeModal(true)
  }

  return createStagedActions({
    confirmReset: false,
    name: 'DeleteConceptActions',
    onDiscard: handleCancel,
    onStage: handleStage,
    stageDisabled: !modalData?.isValid,
  })
}

export default DeleteConceptActions
