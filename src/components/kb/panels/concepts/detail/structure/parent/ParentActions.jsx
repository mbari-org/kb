import { use, useEffect, useState } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'

const DISCARD = 'Discard'
const SAVE = 'Save'

const ParentActions = () => {
  const { editingState, initialState, modifyConcept } = use(ConceptContext)
  const { setModal } = use(ModalContext)

  const [saveDisabled, setSaveDisabled] = useState(true)

  const colors = ['cancel', 'main']
  const disabled = [false, saveDisabled]
  const labels = [DISCARD, SAVE]

  const onAction = label => {
    if (label === SAVE) {
      modifyConcept({
        type: CONCEPT_STATE.PARENT_UPDATE,
        update: { parentName: editingState.parentName },
      })
    }

    setModal(null)
  }

  useEffect(() => {
    setSaveDisabled(editingState.parentName === initialState.parentName)
  }, [editingState, initialState])

  return createActions({ colors, disabled, labels, onAction }, 'ConceptNameUpdateActions')
}

export default ParentActions
