import { use } from 'react'

import {
  createStagedActions,
  createStageDiscardHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const DeleteMediaActions = () => {
  const {
    stagedState: { media, mediaIndex },
    modifyConcept,
  } = use(ConceptStagedContext)
  const { closeModal } = use(ConceptModalContext)

  const stageAction = {
    type: CONCEPT_STATE.MEDIA_ITEM.DELETE,
    update: {
      mediaIndex,
      mediaItem: { ...media[mediaIndex], action: CONCEPT_STATE.MEDIA_ITEM.DELETE },
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
    name: 'DeleteMediaActions',
  })
}

export default DeleteMediaActions
