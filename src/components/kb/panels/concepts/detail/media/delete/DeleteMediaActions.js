import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const DISCARD = 'Discard'
const STAGE = 'Stage'

const DeleteMediaActions = () => {
  const {
    editingState: { mediaIndex },
    modifyConcept,
  } = use(ConceptContext)
  const { closeModal } = use(ModalContext)

  const colors = ['cancel', 'main']
  const labels = [DISCARD, STAGE]

  const onAction = label => {
    if (label === STAGE) {
      modifyConcept({ type: CONCEPT_STATE.MEDIA.DELETE, update: { mediaIndex } })
    }
    closeModal()
  }

  return createActions({ colors, labels, onAction }, 'DeleteMediaActions')
}

export default DeleteMediaActions
