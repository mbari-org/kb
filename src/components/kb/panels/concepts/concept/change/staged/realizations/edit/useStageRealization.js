import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const useStageRealization = () => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

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

    if (action === CONCEPT_STATE.REALIZATION_ITEM.ADD) {
      modifyConcept({
        type: CONCEPT_STATE.FIELD.SET,
        update: { field: 'realizationIndex', value: realizationIndex },
      })
    }

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
