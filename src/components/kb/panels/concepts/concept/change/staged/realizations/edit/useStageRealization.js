import { use } from 'react'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

const useStageRealization = () => {
  const { modifyConcept } = use(ConceptStagedContext)
  const { closeModal } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)

  const stageRealization = async event => {
    event.preventDefault()

    const { action, realizationIndex, realizationItem } = modalData

    modifyConcept({
      type: action,
      update: {
        realizationIndex,
        realizationItem,
      },
    })

    closeModal(true)
  }

  const stageChange = event => {
    const { isDuplicate } = modalData

    if (isDuplicate) {
      event.preventDefault()
      return
    }

    stageRealization(event)
  }

  return stageChange
}

export default useStageRealization
