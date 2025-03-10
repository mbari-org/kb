import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const useStageMedia = () => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ModalContext)

  const stageMedia = async event => {
    event.preventDefault()

    const { action, mediaIndex, mediaItem } = modalData

    modifyConcept({
      type: action,
      update: {
        mediaIndex,
        mediaItem,
      },
    })

    if (action === CONCEPT_STATE.MEDIA.ADD) {
      modifyConcept({
        type: CONCEPT_STATE.FIELD.SET,
        update: { field: 'mediaIndex', value: mediaIndex },
      })
    }

    closeModal(true)
  }

  return stageMedia
}

export default useStageMedia
