import { use } from 'react'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

const useStageMedia = () => {
  const { modifyConcept } = use(ConceptStagedContext)
  const { closeModal } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)

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
