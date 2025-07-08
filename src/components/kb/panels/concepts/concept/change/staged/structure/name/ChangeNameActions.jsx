import { use } from 'react'

import {
  createStagedActions,
  createConfirmationHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const { SET } = CONCEPT_STATE.FIELD

const ChangeNameActions = () => {
  const { concept, confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  // Handle case where modalData might be undefined
  const { isValid = false, name = '', nameChangeType = '' } = modalData || {}

  const { handleConfirmDiscard, handleContinue, handleDiscard } = createConfirmationHandlers({
    modifyConcept,
    closeModal,
    concept,
  })

  const handleStage = () => {
    modifyConcept({
      type: SET,
      update: {
        field: 'name',
        value: name,
      },
    })
    modifyConcept({
      type: SET,
      update: {
        field: 'nameChange',
        value: nameChangeType,
      },
    })
    closeModal(true)
  }

  return createStagedActions({
    onDiscard: handleDiscard,
    onStage: handleStage,
    stageDisabled: !isValid,
    confirmReset,
    onConfirmDiscard: handleConfirmDiscard,
    onContinue: handleContinue,
    name: 'ChangeNameActions',
  })
}

export default ChangeNameActions
