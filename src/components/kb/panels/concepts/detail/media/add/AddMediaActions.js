import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { EDIT_MEDIA_FORM_ID } from '../edit/EditMediaContent'

const STAGE = 'Stage'
const DISCARD = 'Discard'

const AddMediaActions = () => {
  const { editingState } = use(ConceptContext)
  const { setModal } = use(ModalContext)

  const colors = ['cancel', 'main']
  const labels = [DISCARD, STAGE]

  const onAction = label => {
    if (label === STAGE) {
      editingState.mediaIndex = editingState.media.length
      document.querySelector(`#${EDIT_MEDIA_FORM_ID}`)?.requestSubmit()
    } else {
      setModal(null)
    }
  }

  return createActions({ colors, labels, onAction }, 'ConceptAddMediaActions')
}

export default AddMediaActions
