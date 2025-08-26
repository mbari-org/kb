import { use } from 'react'

import {
  createConfirmationHandlers,
  createStagedActions,
} from '@/components/modal/concept/conceptModalUtils'
import { EDIT_REALIZATION_FORM_ID } from './form/RealizationForm'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { hasTrue } from '@/lib/utils'

const EditRealizationActions = () => {
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

  const handleStage = () => {
    // go through form to trigger required / validation checks
    document.querySelector(`#${EDIT_REALIZATION_FORM_ID}`)?.requestSubmit()
  }

  const stageDisabled =
    isDuplicate || !isValidToConcept || !hasTrue(modified) || !validRealization(realizationItem)

  return createStagedActions({
    onDiscard: handleDiscard,
    onStage: handleStage,
    stageDisabled,
    confirmReset,
    name: 'EditRealizationActions',
    onConfirm: handleConfirm,
    onContinue: handleContinue,
  })
}

export default EditRealizationActions
