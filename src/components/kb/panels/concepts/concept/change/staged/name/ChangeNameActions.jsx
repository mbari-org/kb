import { use } from 'react'

import {
  createStagedActions,
  createConfirmationHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const ChangeNameActions = () => {
  const { concept, confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  const { isValid, name } = modalData

  const { handleConfirm, handleContinue, handleDiscard } = createConfirmationHandlers({
    closeModal,
    concept,
    modifyConcept,
  })

  const handleStage = () => {
    modifyConcept({
      type: CONCEPT_STATE.NAME,
      update: name,
    })

    closeModal(true)
  }

  return createStagedActions({
    confirmReset,
    name: 'ChangeNameActions',
    onConfirm: handleConfirm,
    onContinue: handleContinue,
    onDiscard: handleDiscard,
    onStage: handleStage,
    stageDisabled: !isValid,
  })
}

export default ChangeNameActions
