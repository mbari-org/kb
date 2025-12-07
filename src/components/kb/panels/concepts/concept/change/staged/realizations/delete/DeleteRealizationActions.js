import { use } from 'react'

import {
  createStagedActions,
  createStageDiscardHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/kb/constants/conceptState.js'

const DeleteRealizationActions = () => {
  const {
    stagedState: { realizations },
    modifyConcept,
  } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  const realizationIndex = modalData?.realizationIndex ?? 0
  const realization = realizations?.[realizationIndex]

  const stageAction = {
    type: CONCEPT_STATE.REALIZATION.DELETE,
    update: {
      realizationIndex,
      realizationItem: {
        ...realization,
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
