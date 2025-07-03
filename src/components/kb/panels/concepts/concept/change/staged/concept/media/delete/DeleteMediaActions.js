import { use } from 'react'

import { createStageDiscardHandlers, createConceptActions } from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

import { LABELS } from '@/lib/constants'

const { DISCARD, STAGE } = LABELS.BUTTON

const DeleteMediaActions = () => {
  const {
    stagedState: { media, mediaIndex },
    modifyConcept,
  } = use(ConceptContext)
  const { closeModal } = use(ConceptModalContext)

  const stageAction = {
    type: CONCEPT_STATE.MEDIA.DELETE,
    update: {
      mediaIndex,
      mediaItem: { ...media[mediaIndex], action: CONCEPT_STATE.MEDIA.DELETE },
    },
  }

  const { handleDiscard, handleStage } = createStageDiscardHandlers({
    modifyConcept,
    closeModal,
    stageAction
  })

  return createConceptActions({
    onDiscard: handleDiscard,
    onStage: handleStage,
    name: 'DeleteMediaActions'
  })
}

export default DeleteMediaActions
