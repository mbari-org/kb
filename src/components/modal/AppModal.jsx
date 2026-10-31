import { use } from 'react'

import ModalShell from '@/components/modal/ModalShell'
import AppModalContext from '@/contexts/app/AppModalContext'

const AppModal = () => {
  const { modal, closeModal } = use(AppModalContext)

  if (!modal) {
    return null
  }

  return (
    <ModalShell
      {...modal}
      closeModal={closeModal}
      backdropClose
      ariaLabelledBy='system-modal-alert'
    />
  )
}

export default AppModal
