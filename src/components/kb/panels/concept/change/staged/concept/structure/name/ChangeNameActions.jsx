import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

import { LABELS } from '@/lib/constants'

const { CHANGE_NAME } = CONCEPT_STATE.STRUCTURE
const { SET } = CONCEPT_STATE.FIELD
const { CONFIRMED } = CONCEPT_STATE.RESET
const { CONFIRM_DISCARD, CONTINUE, DISCARD } = LABELS.BUTTON
const { ASSOCIATED_DATA, NAME_ONLY } = LABELS.CONCEPT.CHANGE_NAME

const ChangeNameActions = () => {
  const { concept, confirmDiscard, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ModalContext)

  let colors, disabled, labels

  if (confirmDiscard) {
    colors = ['cancel', 'main']
    disabled = [false, !modalData.modified]
    labels = [CONFIRM_DISCARD, CONTINUE]
  } else {
    colors = ['cancel', 'main', 'main']
    disabled = modalData.modified ? [false, false, false] : [false, true, true]
    labels = [DISCARD, NAME_ONLY, ASSOCIATED_DATA]
  }

  const onAction = label => {
    switch (label) {
      case ASSOCIATED_DATA:
      case NAME_ONLY:
        modifyConcept({
          type: SET,
          update: { field: 'name', value: modalData.name },
        })
        modifyConcept({
          type: CHANGE_NAME,
          update: { field: 'nameChange', value: label },
        })
        closeModal(true)
        break

      case CONFIRM_DISCARD:
        modifyConcept({
          type: CONFIRMED.YES,
          update: { name: concept.name },
        })
        closeModal(true)
        break

      case CONTINUE:
        modifyConcept({ type: CONFIRMED.NO })
        break

      case DISCARD:
        closeModal()
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptNameUpdateActions')
}

export default ChangeNameActions
