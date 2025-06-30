import { use } from 'react'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const useStageMedia = () => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(PanelModalContext)

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
