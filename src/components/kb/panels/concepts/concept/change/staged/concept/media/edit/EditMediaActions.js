import { use, useMemo } from 'react'

import { createActions } from '@/components/modal/factory'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { EDIT_MEDIA_FORM_ID } from './EditMediaContent'

import { CONCEPT_STATE } from '@/lib/constants'

import { LABELS } from '@/lib/constants'

import { isUrlValid } from '@/lib/utils'

const { CONFIRM_DISCARD, CONTINUE, DISCARD, STAGE } = LABELS.BUTTON
const { CONFIRMED } = CONCEPT_STATE.RESET

const EditMediaActions = () => {
  const { confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(PanelModalContext)

  // Handle case where modalData might be empty or undefined
  const { mediaItem = { url: '', credit: '' }, modified = false } = modalData || {}

  const validMediaItem = useMemo(
    () => isUrlValid(mediaItem?.url || '') && (mediaItem?.credit || '').trim() !== '',
    [mediaItem]
  )

  const colors = ['cancel', 'main']
  const disabled = [false, !modified && validMediaItem]
  const labels = confirmReset ? [CONFIRM_DISCARD, CONTINUE] : [DISCARD, STAGE]

  const onAction = label => {
    switch (label) {
      case CONFIRM_DISCARD:
        modifyConcept({ type: CONFIRMED.YES })
        closeModal(true)
        break

      case CONTINUE:
        modifyConcept({ type: CONFIRMED.NO })
        break

      case DISCARD:
        closeModal()
        break

      case STAGE:
        // go through form to trigger required and validation checks
        document.querySelector(`#${EDIT_MEDIA_FORM_ID}`)?.requestSubmit()
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptEditMediaActions')
}

export default EditMediaActions
