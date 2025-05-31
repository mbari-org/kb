import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS } from '@/lib/constants'

const { CANCEL, SAVE } = LABELS.BUTTON

const AddReferenceActions = () => {
  const { closeModal, modalData } = use(ModalContext)
  const { reference, onAddReference } = modalData

  const colors = ['cancel', 'primary']
  const disabled = [false, !reference.citation || !reference.doi]
  const labels = [CANCEL, SAVE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case SAVE:
        try {
          onAddReference(reference)
          closeModal()
        } catch (error) {
          console.error('Error creating reference:', error)
          // TODO: Show error message to user
        }
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'AddReferenceActions')
}

export default AddReferenceActions
