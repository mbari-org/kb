import { use } from 'react'

import {
  createStagedActions,
  createStageDiscardHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const DeleteAliasActions = () => {
  const { modifyConcept } = use(ConceptStagedContext)
  const { closeModal } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)
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

  return createStagedActions({
    onDiscard: handleDiscard,
    onStage: handleStage,
    name: 'DeleteAliasActions',
  })
}

export default DeleteAliasActions
