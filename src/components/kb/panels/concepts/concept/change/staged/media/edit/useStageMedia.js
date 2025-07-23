import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const useStageMedia = () => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

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

    closeModal(true)
  }

  return stageMedia
}

export default useStageMedia
