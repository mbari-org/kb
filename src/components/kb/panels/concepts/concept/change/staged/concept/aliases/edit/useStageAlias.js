import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const useStageAlias = () => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  const stageAlias = async event => {
    event.preventDefault()

    const { action, alias, aliasIndex } = modalData

    modifyConcept({
      type: action,
      update: {
        alias,
        aliasIndex,
      },
    })

    modifyConcept({
      type: CONCEPT_STATE.FIELD.SET,
      update: { field: 'aliasIndex', value: aliasIndex },
    })

    closeModal(true)
  }

  return stageAlias
}

export default useStageAlias
