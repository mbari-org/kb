import { use } from 'react'
import { createActions } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'
import { LABELS, PROCESSING } from '@/lib/constants'

const { CANCEL, SAVE } = LABELS.BUTTON
const { SAVING } = PROCESSING

const AddTemplateActions = ({ addTemplate }) => {
  const { closeModal, modalData, setProcessing } = use(ModalContext)
  const { template } = modalData

  const colors = ['cancel', 'primary']
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
        setProcessing(SAVING)
        await addTemplate(template)
        setProcessing(false)
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'AddTemplateActions')
}

export default AddTemplateActions
