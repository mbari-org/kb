import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT } from '@/contexts/concept/lib/conceptStateReducer'

const CANCEL = 'Cancel'
const DELETE = 'Delete'

const DeleteMediaActions = ({ mediaIndex }) => {
  const { modifyConcept } = use(ConceptContext)
  const { setModal } = use(ModalContext)

  const colors = ['main', 'cancel']
  const labels = [CANCEL, DELETE]

  const onAction = label => {
    if (label === DELETE) {
      modifyConcept({ type: CONCEPT.MEDIA_DELETE, update: { mediaIndex } })
    }
    setModal(null)
  }

  return createActions({ colors, labels, onAction }, 'DeleteMediaActions')
}

export default DeleteMediaActions
