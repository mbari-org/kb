import { use } from 'react'

import {
  createConfirmationHandlers,
  createStagedActions,
} from '@/components/modal/concept/conceptModalUtils'
import { EDIT_REALIZATION_FORM_ID } from './form/RealizationForm'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { hasTrue } from '@/lib/utils'

const RealizationActions = () => {
  const { concept, confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  const { isDuplicate, modified, realizationItem, isValidToConcept = true } = modalData || {}

  const validRealization = item =>
    item.linkName?.trim() !== '' && item.toConcept?.trim() !== '' && item.linkValue?.trim() !== ''

  const { handleConfirm, handleContinue, handleDiscard } = createConfirmationHandlers({
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

  const stageDisabled =
    isDuplicate || !isValidToConcept || !hasTrue(modified) || !validRealization(realizationItem)

  return createStagedActions({
    onDiscard: handleDiscardAction,
    onStage: handleStage,
    stageDisabled,
    confirmReset: shouldShowConfirmReset,
    onConfirm: handleConfirm,
    onContinue: handleContinue,
    name: 'EditRealizationActions',
  })
}

export default RealizationActions
