import { use } from 'react'

import {
  createStagedActions,
  createConfirmationHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ADD_ALIAS_FORM_ID } from './EditAliasContent'

import { hasTrue } from '@/lib/utils'

const EditAliasActions = () => {
  const { concept, confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

  const { aliasItem, modified } = modalData

  const validName =
    !modified.name || (aliasItem.name !== '' && !getNames().includes(aliasItem.name))

  const { handleConfirm, handleContinue, handleDiscard } = createConfirmationHandlers({
    closeModal,
    concept,
    modifyConcept,
  })

  const handleStage = () => {
    // go through the form to trigger required/validation checks
    document.querySelector(`#${ADD_ALIAS_FORM_ID}`)?.requestSubmit()
  }

  const stageDisabled = !validName || !hasTrue(modified)

  return createStagedActions({
    confirmReset,
    name: 'EditAliasActions',
    onConfirm: handleConfirm,
    onContinue: handleContinue,
    onDiscard: handleDiscard,
    onStage: handleStage,
    stageDisabled,
  })
}

export default EditAliasActions
