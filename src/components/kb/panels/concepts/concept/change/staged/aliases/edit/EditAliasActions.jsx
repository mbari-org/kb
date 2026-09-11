import { use } from 'react'

import { createStagedActions } from '@/components/modal/concept/conceptModalUtils'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import useConceptNameValidate from '@/components/kb/panels/concepts/concept/change/staged/useConceptNameValidate'

import { ADD_ALIAS_FORM_ID } from './EditAliasContent'

import { hasTrueValue } from '@/lib/utils'

const EditAliasActions = () => {
  const { confirmReset, modifyConcept } = use(ConceptStagedContext)
  const { closeModal } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)

  const { aliasItem, modified } = modalData

  const { isValidName } = useConceptNameValidate(aliasItem, modified)
  const nameError = modified.name && !isValidName

  const handleStage = () => {
    // go through the form to trigger required/validation checks
    document.querySelector(`#${ADD_ALIAS_FORM_ID}`)?.requestSubmit()
  }

  const stageDisabled = nameError || !hasTrueValue(modified)

  return createStagedActions({
    closeModal,
    confirmReset,
    modifyConcept,
    name: 'EditAliasActions',
    onStage: handleStage,
    stageDisabled,
  })
}

export default EditAliasActions
