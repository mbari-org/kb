import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const useStageAlias = () => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  const stageAlias = async event => {
    event.preventDefault()

    const { action, aliasIndex, aliasItem } = modalData

    modifyConcept({
      type: action,
      update: {
        aliasIndex,
        aliasItem,
      },
    })

    closeModal(true)
  }

  return stageAlias
}

export default useStageAlias
