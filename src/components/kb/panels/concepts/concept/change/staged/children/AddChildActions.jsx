import { use } from 'react'

import { createStagedActions } from '@/components/modal/concept/conceptModalUtils'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import useConceptNameValidate from '@/components/kb/panels/concepts/concept/change/staged/useConceptNameValidate'

import { ADD_CHILD_FORM_ID } from './AddChildContent'

const AddChildActions = () => {
  const { confirmReset, modifyConcept } = use(ConceptStagedContext)
  const { closeModal } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)

  const { child, modified } = modalData

  const { isValidName } = useConceptNameValidate(child, {})

  const handleStage = () => {
    // Need to go through the form to trigger required and validation checks
    document.querySelector(`#${ADD_CHILD_FORM_ID}`)?.requestSubmit()
  }

  const stageDisabled = !confirmReset && (!modified || !isValidName)

  return createStagedActions({
    closeModal,
    confirmReset,
    modifyConcept,
    name: 'AddChildActions',
    onStage: handleStage,
    stageDisabled,
  })
}

export default AddChildActions
