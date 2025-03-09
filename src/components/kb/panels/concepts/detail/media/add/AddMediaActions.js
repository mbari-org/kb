import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { EDIT_MEDIA_FORM_ID } from '../edit/EditMediaContent'

const DISCARD = 'Discard'
const STAGE = 'Stage'

const AddMediaActions = () => {
  const { stagedState } = use(ConceptContext)
  const { closeModal } = use(ModalContext)

  const colors = ['cancel', 'main']
  const labels = [DISCARD, STAGE]

  const onAction = label => {
    if (label === STAGE) {
      stagedState.mediaIndex = stagedState.media.length
      document.querySelector(`#${EDIT_MEDIA_FORM_ID}`)?.requestSubmit()
    } else {
      closeModal()
    }
  }

  return createActions({ colors, labels, onAction }, 'ConceptAddMediaActions')
}

export default AddMediaActions
