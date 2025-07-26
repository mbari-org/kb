import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const useStageChild = () => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  const stageChild = async event => {
    event.preventDefault()

    const { action, child, index } = modalData

    modifyConcept({
      type: action,
      update: { child, index },
    })

    closeModal(true)
  }

  return stageChild
}

export default useStageChild
