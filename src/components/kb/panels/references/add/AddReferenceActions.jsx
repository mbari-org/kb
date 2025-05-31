import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'
import useReferences from '../useReferences'

import { LABELS } from '@/lib/constants'

const { CANCEL, SAVE } = LABELS.BUTTON

const AddReferenceActions = () => {
  const { closeModal, modalData } = use(ModalContext)
  const { reference } = modalData
  const { addReference, references } = useReferences()

  const isDoiUnique = doi => {
    if (!doi) return true
    return !references.some(ref => ref.doi === doi)
  }

  const colors = ['cancel', 'primary']
  const disabled = [false, !reference.citation || !reference.doi || !isDoiUnique(reference.doi)]
  const labels = [CANCEL, SAVE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case SAVE:
        try {
          await addReference(reference)
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
