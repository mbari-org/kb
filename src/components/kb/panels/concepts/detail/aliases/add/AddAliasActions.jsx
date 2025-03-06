import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { ADD_ALIAS_FORM_ID } from './AddAliasContent'

const DISCARD = 'Discard'
const STAGE = 'Stage'

const AddAliasActions = () => {
  const { _editingState } = use(ConceptContext)
  const { closeModal } = use(ModalContext)

  const colors = ['cancel', 'main']
  const disabled = [false, true]
  const labels = [DISCARD, STAGE]

  const onAction = label => {
    label === STAGE
      ? document.querySelector(`#${ADD_ALIAS_FORM_ID}`)?.requestSubmit()
      : closeModal()
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptAddAliasActions')
}

export default AddAliasActions
