import { use } from 'react'
import { createActions } from '@/components/modal/panelModalFactory'

import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

import { isValidTemplate } from '@/components/kb/panels/templates/utils'

import { LABELS, PROCESSING } from '@/lib/constants'
const { CANCEL, SAVE } = LABELS.BUTTON
const { SAVING } = PROCESSING

const AddTemplateActions = ({ addTemplate }) => {
  const { closeModal, modalData, setProcessing } = use(HOLDModalContext)
  const { template } = modalData

  const colors = ['cancel', 'primary']
  const disabled = [false, !isValidTemplate(template) || !modalData.modified]
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
