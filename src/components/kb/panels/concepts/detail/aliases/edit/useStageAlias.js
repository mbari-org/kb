import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

const useStageAlias = () => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ModalContext)

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
