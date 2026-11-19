import { use } from 'react'

import { createStageDiscardHandlers, createStagedActions } from '@/components/modal/concept/conceptModalUtils'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const DeleteTemplateActions = () => {
  const { modifyConcept } = use(ConceptStagedContext)
  const { closeModal } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)

  const stageAction = {
    type: CONCEPT_STATE.TEMPLATE.DELETE,
    update: { templateStateId: modalData.templateStateId },
  }

  const { handleDiscard, handleStage } = createStageDiscardHandlers({
    modifyConcept,
    closeModal,
    stageAction,
  })

  return createStagedActions({
    onDiscard: handleDiscard,
    onStage: handleStage,
    name: 'DeleteTemplateActions',
  })
}

export default DeleteTemplateActions
