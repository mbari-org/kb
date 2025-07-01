import { use } from 'react'

import { createActions } from '@/components/modal/panelModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

import { LABELS } from '@/lib/constants'

const { CONFIRM_DISCARD, CONTINUE, DISCARD, STAGE } = LABELS.BUTTON
const { CONFIRMED } = CONCEPT_STATE.RESET
const { CHANGE_PARENT } = CONCEPT_STATE.STRUCTURE
const ChangeParentActions = () => {
  const { confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(HOLDModalContext)

  // Handle case where modalData might be undefined
  const { modified = false, parent = '' } = modalData || {}

  const colors = ['cancel', 'main']
  const disabled = [false, !modified]
  const labels = confirmReset ? [CONFIRM_DISCARD, CONTINUE] : [DISCARD, STAGE]

  const onAction = label => {
    switch (label) {
      case CONFIRM_DISCARD:
        modifyConcept({ type: CONFIRMED.YES })
        closeModal(true)
        break

      case CONTINUE:
        modifyConcept({ type: CONFIRMED.NO })
        break

      case DISCARD:
        closeModal()
        break

      case STAGE:
        modifyConcept({
          type: CHANGE_PARENT,
          update: { parent },
        })
        closeModal(true)

        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptNameUpdateActions')
}

export default ChangeParentActions
