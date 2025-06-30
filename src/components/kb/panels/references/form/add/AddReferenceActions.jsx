import { use } from 'react'

import { createActions } from '@/components/modal/panelModalFactory'

import KBDataContext from '@/contexts/kbData/KBDataContext'
import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

import { LABELS, PROCESSING } from '@/lib/constants'

const { CANCEL, SAVE } = LABELS.BUTTON
const { SAVING } = PROCESSING

const AddReferenceActions = ({ addReference }) => {
  const { closeModal, modalData, setProcessing } = use(PanelModalContext)
  const { isDoiUnique } = use(KBDataContext)

  const { reference } = modalData

  const colors = ['cancel', 'primary']
  const disabled = [false, !reference.citation || !reference.doi || !isDoiUnique(reference.doi)]
  const labels = [CANCEL, SAVE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case SAVE:
        closeModal()
        setProcessing(SAVING)
        await addReference(reference)
        setProcessing(false)
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'AddReferenceActions')
}

export default AddReferenceActions
