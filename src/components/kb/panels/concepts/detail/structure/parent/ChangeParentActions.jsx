import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

import LABELS from '@/components/kb/panels/concepts/stagedState/labels'

const { CONFIRM_DISCARD, CONTINUE, DISCARD, STAGE } = LABELS.ACTION
const { CONFIRMED } = CONCEPT_STATE.RESET
const { CHANGE_PARENT } = CONCEPT_STATE.STRUCTURE
const ChangeParentActions = () => {
  const { confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ModalContext)

  const colors = ['cancel', 'main']
  const disabled = [false, !modalData.modified]
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
          update: { parent: modalData.parent },
        })
        closeModal(true)

        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptNameUpdateActions')
}

export default ChangeParentActions
