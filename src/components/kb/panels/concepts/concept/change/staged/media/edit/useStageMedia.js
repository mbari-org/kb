import { use } from 'react'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const useStageMedia = () => {
  const { modifyConcept } = use(ConceptStagedContext)
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
