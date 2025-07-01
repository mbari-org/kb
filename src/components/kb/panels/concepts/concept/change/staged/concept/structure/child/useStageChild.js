import { use } from 'react'

import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const useStageChild = () => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(HOLDModalContext)

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
