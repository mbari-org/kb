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

  // Handle case where modalData might be empty or undefined
  const { mediaItem = { url: '', credit: '' }, modified = false } = modalData || {}

  const validMediaItem = useMemo(
    () => isUrlValid(mediaItem?.url || '') && (mediaItem?.credit || '').trim() !== '',
    [mediaItem]
  )

  const { handleConfirm, handleContinue, handleDiscard } = createConfirmationHandlers({
    modifyConcept,
    closeModal,
    concept,
  })

  const handleStage = () => {
    // go through form to trigger required / validation checks
    document.querySelector(`#${EDIT_MEDIA_FORM_ID}`)?.requestSubmit()
  }

  const stageDisabled = !modified && validMediaItem

  return createStagedActions({
    onDiscard: handleDiscard,
    onStage: handleStage,
    stageDisabled,
    confirmReset,
    onConfirm: handleConfirm,
    onContinue: handleContinue,
    name: 'EditMediaActions',
  })
}

export default EditMediaActions
