import { use } from 'react'

import {
  createStagedActions,
  createConfirmationHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const { CHANGE_PARENT } = CONCEPT_STATE.STRUCTURE
const ChangeParentActions = () => {
  const { concept, confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  // Handle case where modalData might be undefined
  const { modified = false, parent = '' } = modalData || {}

  const { handleConfirmDiscard, handleContinue, handleDiscard } = createConfirmationHandlers({
    modifyConcept,
    closeModal,
    concept,
  })

  const handleStage = () => {
    modifyConcept({
      type: CHANGE_PARENT,
      update: { parent },
    })
    closeModal(true)
  }

  return createStagedActions({
    onDiscard: handleDiscard,
    onStage: handleStage,
    stageDisabled: !modified,
    confirmReset,
    onConfirmDiscard: handleConfirmDiscard,
    onContinue: handleContinue,
    name: 'ChangeParentActions',
  })
}

export default ChangeParentActions
