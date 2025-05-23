import { use, useCallback } from 'react'

import EditUserActions from './EditUserActions'
import EditUserContent from './EditUserContent'
import EditUserTitle from './EditUserTitle'

import { createModal } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'

const editUserModal = () => {
  const components = {
    Actions: EditUserActions,
    Content: EditUserContent,
    Title: EditUserTitle,
  }

  return createModal(components)
}

const useEditUser = onEdit => {
  const { setModal, setModalData } = use(ModalContext)

  return useCallback(
    user => {
      const modal = editUserModal()
      const onClose = (modalData, confirmed) => {
        if (confirmed) {
          onEdit(modalData.user)
        }
        return true
      }
      setModal(modal, onClose)
      setModalData({ user })
    },
    [onEdit, setModal, setModalData]
  )
}

export default useEditUser
