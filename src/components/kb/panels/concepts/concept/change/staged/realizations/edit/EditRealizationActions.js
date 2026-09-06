import { use } from 'react'

import { createStagedActions } from '@/components/modal/concept/conceptModalUtils'
import { EDIT_REALIZATION_FORM_ID } from './form/RealizationForm'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import { hasTrueValue } from '@/lib/utils'

const EditRealizationActions = () => {
  const { confirmReset, modifyConcept } = use(ConceptStagedContext)
  const { closeModal } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)

  const { isDuplicate, modified, realizationItem, isValidToConcept = true } = modalData || {}

  const validRealization = item =>
    item.linkName?.trim() !== '' && item.toConcept?.trim() !== '' && item.linkValue?.trim() !== ''

  const handleStage = () => {
    // go through form to trigger required / validation checks
    document.querySelector(`#${EDIT_REALIZATION_FORM_ID}`)?.requestSubmit()
  }

  const stageDisabled =
    isDuplicate || !isValidToConcept || !hasTrueValue(modified) || !validRealization(realizationItem)

  return createStagedActions({
    closeModal,
    confirmReset,
    modifyConcept,
    name: 'EditRealizationActions',
    onStage: handleStage,
    stageDisabled,
  })
}

export default EditRealizationActions
