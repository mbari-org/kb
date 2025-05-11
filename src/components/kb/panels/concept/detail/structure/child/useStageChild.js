import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

const useStageChild = () => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ModalContext)

  const stageChild = async event => {
    event.preventDefault()

    const { action, child } = modalData

    modifyConcept({
      type: action,
      update: { child },
    })

    closeModal(true)
  }

  return stageChild
}

export default useStageChild
