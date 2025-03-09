import { use, useMemo } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { EDIT_MEDIA_FORM_ID } from './EditMediaContent'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

import { isValidUrl } from '@/lib/util'

const CONFIRM_DISCARD = 'Confirm Discard'
const CONTINUE = 'Continue'
const DISCARD = 'Discard'
const STAGE = 'Stage'

const EditMediaActions = () => {
  const { confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ModalContext)

  const { mediaItem, modified } = modalData

  const validMediaItem = useMemo(
    () => isValidUrl(mediaItem.url) && mediaItem.credit.trim() !== '',
    [mediaItem]
  )

  const colors = ['cancel', 'main']
  const disabled = [false, !modified && validMediaItem]
  const labels = confirmReset ? [CONFIRM_DISCARD, CONTINUE] : [DISCARD, STAGE]

  const onAction = label => {
    switch (label) {
      case CONTINUE:
        modifyConcept({ type: CONCEPT_STATE.RESET.CONFIRMED.NO })
        break

      case CONFIRM_DISCARD:
        modifyConcept({ type: CONCEPT_STATE.RESET.CONFIRMED.YES })
        closeModal(true)
        break

      case DISCARD:
        closeModal()
        break

      case STAGE:
        // Need to go through the form to trigger required and validation checks
        document.querySelector(`#${EDIT_MEDIA_FORM_ID}`)?.requestSubmit()
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptEditMediaActions')
}

export default EditMediaActions
