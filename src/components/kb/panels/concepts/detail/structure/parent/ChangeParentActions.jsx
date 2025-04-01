import { use, useMemo } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

import LABELS from '@/components/kb/panels/concepts/stagedState/labels'

const { CHANGE_PARENT } = CONCEPT_STATE.STRUCTURE
const { DISCARD, STAGE } = LABELS.ACTION

const ChangeParentActions = () => {
  const { stagedState, initialState, modifyConcept } = use(ConceptContext)
  const { closeModal } = use(ModalContext)

  const isDisabled = useMemo(() => {
    return stagedState.parent === initialState.parent
  }, [stagedState, initialState])

  const colors = ['cancel', 'main']
  const disabled = [false, isDisabled]
  const labels = [DISCARD, STAGE]

  const onAction = label => {
    if (label === STAGE) {
      modifyConcept({
        type: CHANGE_PARENT,
        update: { parent: stagedState.parent },
      })
    }

    closeModal()
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptNameUpdateActions')
}

export default ChangeParentActions
