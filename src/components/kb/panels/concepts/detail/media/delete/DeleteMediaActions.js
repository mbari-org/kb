import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const DISCARD = 'Discard'
const STAGE = 'Stage'

const DeleteMediaActions = ({ mediaIndex }) => {
  const { modifyConcept } = use(ConceptContext)
  const { setModal } = use(ModalContext)

  const colors = ['cancel', 'main']
  const labels = [DISCARD, STAGE]

  const onAction = label => {
    if (label === STAGE) {
      modifyConcept({ type: CONCEPT_STATE.MEDIA.DELETE, update: { mediaIndex } })
    }
    setModal(null)
  }

  return createActions({ colors, labels, onAction }, 'DeleteMediaActions')
}

export default DeleteMediaActions
