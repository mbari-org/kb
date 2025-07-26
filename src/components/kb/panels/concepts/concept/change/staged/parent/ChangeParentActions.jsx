import { use } from 'react'

import {
  createStagedActions,
  createConfirmationHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'
import { hasTrue } from '@/lib/utils'

const { PARENT } = CONCEPT_STATE

const ChangeParentActions = () => {
  const { concept, confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  // Handle case where modalData might be undefined
  const { modified = false, parent = '' } = modalData || {}

  const isModified = hasTrue(modified)

  const { handleConfirmDiscard, handleContinue, handleDiscard } = createConfirmationHandlers({
    modifyConcept,
    closeModal,
    concept,
  })

  const handleStage = () => {
    modifyConcept({
      type: PARENT,
      update: { parent },
    })
    closeModal(true)
  }

  return createStagedActions({
    confirmReset,
    name: 'ChangeParentActions',
    onConfirmDiscard: handleConfirmDiscard,
    onContinue: handleContinue,
    onDiscard: handleDiscard,
    onStage: handleStage,
    stageDisabled: !isModified,
  })
}

export default ChangeParentActions
