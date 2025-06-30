import { use } from 'react'

import { createActions } from '@/components/modal/panelModalFactory'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
import UsersContext from '@/contexts/panels/users/UsersContext'

import { LABELS, PROCESSING } from '@/lib/constants'

const { CANCEL, SAVE } = LABELS.BUTTON
const { SAVING } = PROCESSING

const AddUserActions = () => {
  const { closeModal, modalData, setProcessing } = use(PanelModalContext)
  const { addUser } = use(UsersContext)

  const { user } = modalData

  const colors = ['cancel', 'primary']
  const disabled = [false, !user.isValid]
  const labels = [CANCEL, SAVE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case SAVE:
        closeModal()
        setProcessing(SAVING)
        await addUser(user)
        setProcessing(false)
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'AddUserActions')
}

export default AddUserActions
