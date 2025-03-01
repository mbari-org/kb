import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { INTENT } from '@/contexts/concept/lib/edit/useEditingStateDisplay'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const CONFIRM_DISCARD = 'Confirm Discard'
const CONTINUE = 'Continue'
const DISCARD = 'Discard All'
const SAVE = 'Save'

const EditingStateActions = ({ intent }) => {
  const { concept, confirmReset, modifyConcept, submitUpdates } = use(ConceptContext)
  const { setModal } = use(ModalContext)
  const { selectConcept, selectPanel } = use(SelectedContext)

  const colors = ['cancel', 'main']
  const actionLabels = [DISCARD, intent === INTENT.SAVE ? SAVE : CONTINUE]
  const confirmLabels = [CONFIRM_DISCARD, CONTINUE]

  const labels = confirmReset ? confirmLabels : actionLabels

  const onAction = label => {
    switch (label) {
      case CONFIRM_DISCARD:
        modifyConcept({ type: CONCEPT_STATE.RESET.CONFIRMED.YES })
        break
      case CONTINUE:
        selectConcept(concept.name)
        selectPanel('Concepts')
        modifyConcept({ type: CONCEPT_STATE.RESET.CONFIRMED.NO })
        setModal(null)
        break
      case DISCARD:
        modifyConcept({ type: CONCEPT_STATE.RESET.TO_INITIAL })
        break
      case SAVE:
        submitUpdates(true)
        setModal(null)
        break
      default:
        setModal(null)
        break
    }
  }

  return createActions({ colors, labels, onAction }, 'ConceptEditingStateActions')
}

export default EditingStateActions
