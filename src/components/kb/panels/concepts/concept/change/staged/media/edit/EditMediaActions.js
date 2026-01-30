import { use, useMemo } from 'react'

import {
  createConfirmationHandlers,
  createStagedActions,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { EDIT_MEDIA_FORM_ID } from './EditMediaContent'
import { isUrlValid } from '@/lib/utils'

const EditMediaActions = () => {
  const { concept, confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  const { mediaItem = { url: '', credit: '' }, modified = false, formValid } = modalData || {}

  const initialFormValid = useMemo(
    () => isUrlValid(mediaItem?.url || '') && (mediaItem?.credit || '').trim() !== '',
    [mediaItem]
  )

  const { handleConfirm, handleContinue, handleDiscard } = createConfirmationHandlers({
    closeModal,
    concept,
    modifyConcept,
  })

  const handleStage = () => {
    // go through form to trigger required / validation checks
    document.querySelector(`#${EDIT_MEDIA_FORM_ID}`)?.requestSubmit()
  }

  const stageDisabled = formValid === undefined ? !initialFormValid : !formValid

  return createStagedActions({
    confirmReset,
    name: 'EditMediaActions',
    onConfirm: handleConfirm,
    onContinue: handleContinue,
    onDiscard: handleDiscard,
    onStage: handleStage,
    stageDisabled,
  })
}

export default EditMediaActions
