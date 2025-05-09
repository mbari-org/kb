import { use, useMemo } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { EDIT_MEDIA_FORM_ID } from './EditMediaContent'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

import { LABELS } from '@/lib/constants'

import { isUrlValid } from '@/lib/util'

const { CONFIRM_DISCARD, CONTINUE, DISCARD, STAGE } = LABELS.ACTION
const { CONFIRMED } = CONCEPT_STATE.RESET

const EditMediaActions = () => {
  const { confirmDiscard, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ModalContext)

  const { mediaItem, modified } = modalData

  const validMediaItem = useMemo(
    () => isUrlValid(mediaItem.url) && mediaItem.credit.trim() !== '',
    [mediaItem]
  )

  const colors = ['cancel', 'main']
  const disabled = [false, !modified && validMediaItem]
  const labels = confirmDiscard ? [CONFIRM_DISCARD, CONTINUE] : [DISCARD, STAGE]

  const onAction = label => {
    switch (label) {
      case CONTINUE:
        modifyConcept({ type: CONFIRMED.NO })
        break

      case CONFIRM_DISCARD:
        modifyConcept({ type: CONFIRMED.YES })
        closeModal(true)
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
