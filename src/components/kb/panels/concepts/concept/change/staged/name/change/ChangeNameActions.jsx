import { use } from 'react'

import { createStagedActions } from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import UserContext from '@/contexts/user/UserContext'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const ChangeNameActions = () => {
  const { concept, confirmReset, initialState, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)
  const { isAdmin } = use(UserContext)

  const { hasRelatedData, isValid, name, relatedDataCounts } = modalData

  const handleDiscard = () => {
    if (name.value !== concept.name) {
      modifyConcept({
        type: CONCEPT_STATE.RESET.NAME,
        update: { name: initialState.name },
      })
    } else {
      closeModal()
    }
  }

  const handleStage = () => {
    modifyConcept({
      type: CONCEPT_STATE.NAME,
      update: {
        ...name,
        action: CONCEPT_STATE.NAME,
        relatedDataCounts,
      },
    })

    closeModal(true)
  }

  const stageDisabled = !isValid || (isAdmin && !confirmReset && hasRelatedData && name.extent === '')

  return createStagedActions({
    closeModal,
    confirmReset,
    modifyConcept,
    name: 'ChangeNameActions',
    onDiscard: handleDiscard,
    onStage: handleStage,
    stageDisabled,
  })
}

export default ChangeNameActions
