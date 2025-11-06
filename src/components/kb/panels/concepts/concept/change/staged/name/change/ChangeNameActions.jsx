import { use } from 'react'

import {
  createStagedActions,
  createConfirmationHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const ChangeNameActions = () => {
  const { concept, confirmReset, initialState, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  const { isValid, name, relatedDataCounts } = modalData

  const { handleConfirm, handleContinue } = createConfirmationHandlers({
    closeModal,
    concept,
    modifyConcept,
  })

  const handleDiscard = () => {
    if (name.value !== concept.name) {
      modifyConcept({
        type: CONCEPT_STATE.RESET.NAME,
        update: { name: initialState.name },
      })
    } else {
      closeModal()
    }
  }

  const handleStage = () => {
    modifyConcept({
      type: CONCEPT_STATE.NAME,
      update: {
        ...name,
        action: CONCEPT_STATE.NAME,
        relatedDataCounts,
      },
    })

    closeModal(true)
  }

  const stageDisabled = !isValid || (!confirmReset && name.extent === '')

  return createStagedActions({
    confirmReset,
    name: 'ChangeNameActions',
    onConfirm: handleConfirm,
    onContinue: handleContinue,
    onDiscard: handleDiscard,
    onStage: handleStage,
    stageDisabled,
  })
}

export default ChangeNameActions
