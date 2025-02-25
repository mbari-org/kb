import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

import { ADD_ALIAS_FORM_ID } from './AddAliasContent'

const DISCARD = 'Discard'
const SAVE = 'Save'

const AddAliasActions = () => {
  const { data, setModal } = use(ModalContext)

  const colors = ['cancel', 'main']
  const disabled = [false, !data?.dirty]
  const labels = [DISCARD, SAVE]

  const onAction = label => {
    label === SAVE
      ? document.querySelector(`#${ADD_ALIAS_FORM_ID}`)?.requestSubmit()
      : setModal(null)
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptAddAliasActions')
}

export default AddAliasActions
