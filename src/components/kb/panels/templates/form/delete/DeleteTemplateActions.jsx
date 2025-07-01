import { use } from 'react'
import { createActions } from '@/components/modal/panelModalFactory'
import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'
import { LABELS, PROCESSING } from '@/lib/constants'

const { CANCEL, DELETE } = LABELS.BUTTON
const { DELETING } = PROCESSING

const DeleteTemplateActions = ({ deleteTemplate }) => {
  const { closeModal, modalData, setProcessing } = use(HOLDModalContext)
  const { template } = modalData

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
        await deleteTemplate(template)
        setProcessing(false)
        break

      default:
        closeModal()
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'DeleteTemplateActions')
}

export default DeleteTemplateActions
