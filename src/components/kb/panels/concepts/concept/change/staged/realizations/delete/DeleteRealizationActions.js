import { use } from 'react'

import {
  createStagedActions,
  createStageDiscardHandlers,
} from '@/components/modal/concept/conceptModalUtils'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const DeleteRealizationActions = () => {
  const {
    stagedState: { realizations },
    modifyConcept,
  } = use(ConceptStagedContext)
  const { closeModal } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)

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
