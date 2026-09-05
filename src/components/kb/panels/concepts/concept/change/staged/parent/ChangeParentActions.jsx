import { use } from 'react'

import { createStagedActions } from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { hasTrue } from '@/lib/utils'

const { PARENT } = CONCEPT_STATE

const ChangeParentActions = () => {
  const { confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)

  // Handle case where modalData might be undefined
  const { modified = false, parent = '' } = modalData || {}

  const isModified = hasTrue(modified)

  const handleStage = () => {
    modifyConcept({
      type: PARENT,
      update: { field: CONCEPT.FIELD.PARENT, value: parent },
    })
    closeModal(true)
  }

  return createStagedActions({
    closeModal,
    confirmReset,
    modifyConcept,
    name: 'ChangeParentActions',
    onStage: handleStage,
    stageDisabled: !isModified,
  })
}

export default ChangeParentActions
