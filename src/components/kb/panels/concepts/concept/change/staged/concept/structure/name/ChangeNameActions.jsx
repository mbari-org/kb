import { use } from 'react'

import { createActions } from '@/components/modal/panelModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

import { LABELS } from '@/lib/constants'

const { SET } = CONCEPT_STATE.FIELD
const { CONFIRMED } = CONCEPT_STATE.RESET
const { CONFIRM_DISCARD, CONTINUE, DISCARD, STAGE } = LABELS.BUTTON

const ChangeNameActions = () => {
  const { concept, confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(PanelModalContext)

  // Handle case where modalData might be undefined
  const { isValid = false, name = '', nameChangeType = '' } = modalData || {}

  const colors = ['cancel', 'main']
  const disabled = [false, !isValid]
  const labels = confirmReset ? [CONFIRM_DISCARD, CONTINUE] : [DISCARD, STAGE]

  const onAction = label => {
    switch (label) {
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

      case STAGE:
        modifyConcept({
          type: SET,
          update: {
            field: 'name',
            value: name,
          },
        })
        modifyConcept({
          type: SET,
          update: {
            field: 'nameChange',
            value: nameChangeType,
          },
        })
        closeModal(true)
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptNameUpdateActions')
}

export default ChangeNameActions
