import { use, useMemo } from 'react'

import {
  createConceptActions,
  createConfirmationHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ADD_ALIAS_FORM_ID } from './EditAliasContent'

const EditAliasActions = () => {
  const { concept, confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

  const { aliasItem, modified } = modalData

  const isModified = useMemo(
    () => Object.values(modified).some(isModified => isModified === true),
    [modified]
  )

  const validName =
    !modified.name || (aliasItem.name !== '' && !getNames().includes(aliasItem.name))

  const { handleConfirmDiscard, handleContinue, handleDiscard } = createConfirmationHandlers({
    modifyConcept,
    closeModal,
    concept,
  })

  const handleStage = () => {
    // Need to go through the form to trigger required and validation checks
    document.querySelector(`#${ADD_ALIAS_FORM_ID}`)?.requestSubmit()
  }

  const stageDisabled = !isModified || !validName

  return createConceptActions({
    onDiscard: handleDiscard,
    onStage: handleStage,
    stageDisabled,
    confirmReset,
    onConfirmDiscard: handleConfirmDiscard,
    onContinue: handleContinue,
    name: 'EditAliasActions',
  })
}

export default EditAliasActions
