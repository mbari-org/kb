import { use, useMemo } from 'react'

import {
  createConfirmationHandlers,
  createStagedActions,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { EDIT_REALIZATION_FORM_ID } from './form/RealizationForm'

const RealizationActions = () => {
  const { concept, confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  const { isDuplicate, modified, realizationItem } = modalData || {}

  const isModified = useMemo(
    () => Object.values(modified).some(isModified => isModified === true),
    [modified]
  )

  const validRealizationItem =
    realizationItem.linkName?.trim() !== '' &&
    realizationItem.toConcept?.trim() !== '' &&
    realizationItem.linkValue?.trim() !== ''

  const { handleConfirmDiscard, handleContinue, handleDiscard } = createConfirmationHandlers({
    closeModal,
    concept,
    modifyConcept,
  })

  // Use normal discard flow regardless of duplicate state
  const handleDiscardAction = handleDiscard

  // Use normal confirmReset flow regardless of duplicate state
  const shouldShowConfirmReset = confirmReset

  const handleStage = () => {
    // go through form to trigger required and validation checks
    document.querySelector(`#${EDIT_REALIZATION_FORM_ID}`)?.requestSubmit()
  }

  const stageDisabled = !isModified || !validRealizationItem || isDuplicate

  return createStagedActions({
    onDiscard: handleDiscardAction,
    onStage: handleStage,
    stageDisabled,
    confirmReset: shouldShowConfirmReset,
    onConfirmDiscard: handleConfirmDiscard,
    onContinue: handleContinue,
    name: 'EditRealizationActions',
  })
}

export default RealizationActions
