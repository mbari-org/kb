import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

import { LABELS, PROCESSING } from '@/lib/constants'

const { CANCEL, SAVE } = LABELS.BUTTON
const { UPDATING } = PROCESSING

const EditReferenceActions = ({ editReference }) => {
  const { closeModal, modalData, setProcessing } = use(ModalContext)
  const { isDoiUnique } = use(ReferencesContext)

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
        closeModal()
        setProcessing(UPDATING)
        await editReference(modalData.originalReference, reference)
        setProcessing(false)
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'EditReferenceActions')
}

export default EditReferenceActions
