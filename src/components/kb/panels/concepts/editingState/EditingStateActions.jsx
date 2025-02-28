import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { INTENT } from '@/contexts/concept/lib/edit/useEditingStateDisplay'

const CONFIRM_DISCARD = 'Confirm Discard'
const CONTINUE = 'Continue'
const DISCARD = 'Discard All'
const SAVE = 'Save'

const EditingStateActions = ({ intent }) => {
  const { concept, initialState, resetState, submitUpdates } = use(ConceptContext)
  const { data, setData, setModal } = use(ModalContext)
  const { selectConcept, selectPanel } = use(SelectedContext)

  const colors = ['cancel', 'main']
  const actionLabels = [DISCARD, intent === INTENT.SAVE ? SAVE : CONTINUE]
  const confirmLabels = [CONFIRM_DISCARD, CONTINUE]

  const labels = data?.confirmResetFn ? confirmLabels : actionLabels

  const onAction = label => {
    switch (label) {
      case CONFIRM_DISCARD:
        data?.confirmResetFn()
        setData({ confirmResetFn: null })
        break
      case CONTINUE:
        selectConcept(concept.name)
        selectPanel('Concepts')
        setModal(null)
        break
      case DISCARD:
        setData({ confirmResetFn: () => resetState(initialState) })
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
