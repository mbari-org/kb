import { use } from 'react'

import { createActions } from '@/components/modal/panelModalFactory'

import PanelDataContext from '@/contexts/panels/PanelDataContext'
import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

import { LABELS, PROCESSING } from '@/lib/constants'

const { CANCEL, SAVE } = LABELS.BUTTON
const { SAVING } = PROCESSING

const AddReferenceActions = ({ addReference }) => {
  const { closeModal, modalData, setProcessing } = use(HOLDModalContext)
  const { isDoiUnique } = use(PanelDataContext)

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
