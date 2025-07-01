import { use } from 'react'

import { createActions } from '@/components/modal/panelModalFactory'

import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

import { LABELS, PROCESSING } from '@/lib/constants'

const { CANCEL, DELETE } = LABELS.BUTTON
const { DELETING } = PROCESSING

const DeleteReferenceActions = ({ deleteReference }) => {
  const { closeModal, modalData, setProcessing } = use(HOLDModalContext)
  const { reference } = modalData

  const colors = ['main', 'cancel']
  const disabled = [false, false]
  const labels = [CANCEL, DELETE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case DELETE:
        closeModal()
        setProcessing(DELETING)
        await deleteReference(reference)
        setProcessing(false)
        break

      default:
        closeModal()
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'DeleteReferenceActions')
}

export default DeleteReferenceActions
