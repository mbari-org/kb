import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS } from '@/lib/constants'

const { CANCEL, SAVE } = LABELS.BUTTON

const EditReferenceActions = ({ editReference, isDoiUnique }) => {
  const { closeModal, modalData } = use(ModalContext)

  const { reference } = modalData

  const colors = ['cancel', 'main']
  const disabled = [
    false,
    !reference.citation ||
      !reference.doi ||
      !isDoiUnique(reference.doi, reference.id) ||
      !modalData.modified ||
      modalData.hasSearchInput ||
      modalData.reference.selectedConcept,
  ]
  const labels = [CANCEL, SAVE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case SAVE:
        await editReference(modalData.originalReference, reference)
        closeModal()
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'EditReferenceActions')
}

export default EditReferenceActions
