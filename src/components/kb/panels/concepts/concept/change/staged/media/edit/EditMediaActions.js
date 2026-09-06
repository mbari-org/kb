import { use, useMemo } from 'react'
import isValidUrl from '@/lib/validators/isValidUrl'

import { createStagedActions } from '@/components/modal/concept/conceptModalUtils'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import { EDIT_MEDIA_FORM_ID } from './EditMediaContent'

const EditMediaActions = () => {
  const { confirmReset, modifyConcept } = use(ConceptStagedContext)
  const { closeModal } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)

  const { mediaItem = { url: '', credit: '' }, modified = false, formValid } = modalData || {}

  const initialFormValid = useMemo(
    () => isValidUrl(mediaItem?.url || '') && (mediaItem?.credit || '').trim() !== '',
    [mediaItem]
  )

  const handleStage = () => {
    // go through form to trigger required / validation checks
    document.querySelector(`#${EDIT_MEDIA_FORM_ID}`)?.requestSubmit()
  }

  const isFormValid = formValid === undefined ? initialFormValid : formValid
  const stageDisabled = !modified || !isFormValid

  return createStagedActions({
    closeModal,
    confirmReset,
    modifyConcept,
    name: 'EditMediaActions',
    onStage: handleStage,
    stageDisabled,
  })
}

export default EditMediaActions
