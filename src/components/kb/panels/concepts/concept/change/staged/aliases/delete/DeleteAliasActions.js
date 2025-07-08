import { use } from 'react'

import {
  createConceptActions,
  createStageDiscardHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const DeleteAliasActions = () => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)
  const { aliasItem, aliasIndex } = modalData

  const stageAction = {
    type: CONCEPT_STATE.ALIAS.DELETE,
    update: {
      aliasIndex,
      aliasItem: { ...aliasItem, action: CONCEPT_STATE.ALIAS.DELETE },
    },
  }

  const { handleDiscard, handleStage } = createStageDiscardHandlers({
    modifyConcept,
    closeModal,
    stageAction,
  })

  return createConceptActions({
    onDiscard: handleDiscard,
    onStage: handleStage,
    name: 'DeleteAliasActions',
  })
}

export default DeleteAliasActions
