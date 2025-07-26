import { use, useMemo } from 'react'

import {
  createStagedActions,
  createConfirmationHandlers,
  validateChildName,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ADD_CHILD_FORM_ID } from './AddChildContent'

const AddChildActions = () => {
  const { concept, confirmReset, modifyConcept, stagedState } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

  const { child, modified } = modalData

  const isValidChild = useMemo(() => {
    return validateChildName(child?.name, getNames(), stagedState.children)
  }, [child?.name, getNames, stagedState.children])

  const { handleConfirm, handleContinue, handleDiscard } = createConfirmationHandlers({
    closeModal,
    concept,
    modifyConcept,
  })

  const handleStage = () => {
    // Need to go through the form to trigger required and validation checks
    document.querySelector(`#${ADD_CHILD_FORM_ID}`)?.requestSubmit()
  }

  const stageDisabled = !confirmReset && (!modified || !isValidChild)

  return createStagedActions({
    confirmReset,
    name: 'AddChildActions',
    onConfirm: handleConfirm,
    onContinue: handleContinue,
    onDiscard: handleDiscard,
    onStage: handleStage,
    stageDisabled,
  })
}

export default AddChildActions
