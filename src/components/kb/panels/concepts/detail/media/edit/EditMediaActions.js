import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

import { EDIT_MEDIA_FORM_ID } from './EditMediaContent'

const DISCARD = 'Discard'
const STAGE = 'Stage'

const EditMediaActions = () => {
  const { modalData, setModal } = use(ModalContext)

  const colors = ['cancel', 'main']
  const disabled = [false, !modalData?.dirty]
  const labels = [DISCARD, STAGE]

  const onAction = label => {
    label === STAGE
      ? document.querySelector(`#${EDIT_MEDIA_FORM_ID}`)?.requestSubmit()
      : setModal(null)
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptEditMediaActions')
}

export default EditMediaActions
