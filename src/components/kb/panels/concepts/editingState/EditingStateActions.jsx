import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { INTENT } from '@/contexts/concept/lib/useDisplayEditingState'

const CONTINUE = 'Continue'
const DISCARD = 'Discard All'
const SAVE = 'Save'

const EditingStateActions = ({ intent }) => {
  const { concept, initialState, resetState, submitUpdates } = use(ConceptContext)
  const { setModal } = use(ModalContext)
  const { selectConcept, selectPanel } = use(SelectedContext)

  const colors = ['cancel', 'main']
  const labels = [DISCARD, intent === INTENT.SAVE ? SAVE : CONTINUE]

  const onAction = label => {
    switch (label) {
      case DISCARD:
        resetState(initialState)
        break
      case CONTINUE:
        selectConcept(concept.name)
        selectPanel('Concepts')
        break
      case SAVE:
        submitUpdates(true)
        break
      default:
        break
    }
    setModal(null)
  }

  return createActions({ colors, labels, onAction }, 'ConceptEditingStateActions')
}

export default EditingStateActions
