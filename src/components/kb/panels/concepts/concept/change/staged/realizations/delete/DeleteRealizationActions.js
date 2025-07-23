import { use } from 'react'

import {
  createStagedActions,
  createStageDiscardHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const DeleteRealizationActions = () => {
  const {
    stagedState: { realizations, realizationIndex },
    modifyConcept,
  } = use(ConceptContext)
  const { closeModal } = use(ConceptModalContext)

  const stageAction = {
    type: CONCEPT_STATE.REALIZATION.DELETE,
    update: {
      realizationIndex,
      realizationItem: {
        ...realizations[realizationIndex],
        action: CONCEPT_STATE.REALIZATION.DELETE,
      },
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
    name: 'DeleteRealizationActions',
  })
}

export default DeleteRealizationActions
