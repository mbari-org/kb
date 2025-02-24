import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'

const CANCEL = 'Cancel'
const DELETE = 'Delete'

const DeleteMediaActions = ({ mediaIndex }) => {
  const { modifyConcept } = use(ConceptContext)
  const { setModal } = use(ModalContext)

  const colors = ['main', 'cancel']
  const labels = [CANCEL, DELETE]

  const onAction = label => {
    if (label === DELETE) {
      modifyConcept({ type: CONCEPT_STATE.MEDIA_DELETE, update: { mediaIndex } })
    }
    setModal(null)
  }

  return createActions({ colors, labels, onAction }, 'DeleteMediaActions')
}

export default DeleteMediaActions
