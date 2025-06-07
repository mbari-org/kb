import { use } from 'react'
import { createActions } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'
import { LABELS, PROCESSING } from '@/lib/constants'

const { CANCEL, SAVE } = LABELS.BUTTON
const { UPDATING } = PROCESSING

const EditTemplateActions = ({ editTemplate }) => {
  const { closeModal, modalData, setProcessing } = use(ModalContext)
  const { template, originalTemplate } = modalData

  const colors = ['cancel', 'main']
  const disabled = [
    false,
    !template.concept || !template.linkName || !template.toConcept || !modalData.modified,
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
        await editTemplate(originalTemplate, template)
        setProcessing(false)
        break

      default:
        closeModal()
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'EditTemplateActions')
}

export default EditTemplateActions
