import { use, useMemo } from 'react'

import {
  createConceptActions,
  createConfirmationHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { EDIT_REALIZATION_FORM_ID } from './RealizationForm'

const EditRealizationActions = () => {
  const { concept, confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  const { realizationItem, modified } = modalData || {}

  const isModified = useMemo(
    () => Object.values(modified).some(isModified => isModified === true),
    [modified]
  )

  const validRealizationItem =
    realizationItem.linkName.trim() !== '' &&
    realizationItem.toConcept.trim() !== '' &&
    realizationItem.linkValue.trim() !== ''

  const { handleConfirmDiscard, handleContinue, handleDiscard } = createConfirmationHandlers({
    modifyConcept,
    closeModal,
    concept,
  })

  const handleStage = () => {
    // go through form to trigger required and validation checks
    document.querySelector(`#${EDIT_REALIZATION_FORM_ID}`)?.requestSubmit()
  }

  const stageDisabled = !isModified || !validRealizationItem

  return createConceptActions({
    onDiscard: handleDiscard,
    onStage: handleStage,
    stageDisabled,
    confirmReset,
    onConfirmDiscard: handleConfirmDiscard,
    onContinue: handleContinue,
    name: 'EditRealizationActions',
  })
}

export default EditRealizationActions
