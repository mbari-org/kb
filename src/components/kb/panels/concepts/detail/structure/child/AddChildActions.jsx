import { use, useEffect, useState } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const DISCARD = 'Discard'
const SAVE = 'Save'

const AddChildActions = () => {
  const { stagedState, initialState, modifyConcept } = use(ConceptContext)
  const { closeModal } = use(ModalContext)

  const [saveDisabled, setSaveDisabled] = useState(true)

  const colors = ['cancel', 'main']
  const disabled = [false, saveDisabled]
  const labels = [DISCARD, SAVE]

  const onAction = label => {
    if (label === SAVE) {
      modifyConcept({
        type: CONCEPT_STATE.STRUCTURE.PARENT_UPDATE,
        update: { parentName: stagedState.parentName },
      })
    }

    closeModal()
  }

  useEffect(() => {
    setSaveDisabled(stagedState.parentName === initialState.parentName)
  }, [stagedState, initialState])

  return createActions({ colors, disabled, labels, onAction }, 'ConceptNameUpdateActions')
}

export default AddChildActions
