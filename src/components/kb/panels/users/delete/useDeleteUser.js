import { use, useCallback } from 'react'

import DeleteUserActions from './DeleteUserActions'
import DeleteUserContent from './DeleteUserContent'
import DeleteUserTitle from './DeleteUserTitle'

import { createModal } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'

const deleteUserModal = () => {
  const components = {
    Actions: DeleteUserActions,
    Content: DeleteUserContent,
    Title: DeleteUserTitle,
  }

  return createModal(components)
}

const useDeleteUser = onDelete => {
  const { setModal, setModalData } = use(ModalContext)

  return useCallback(
    user => {
      const modal = deleteUserModal()
      const onClose = (modalData, confirmed) => {
        if (confirmed) {
          onDelete(user)
        }
        return true
      }
      setModal(modal, onClose)
      setModalData({ user })
    },
    [onDelete, setModal, setModalData]
  )
}

export default useDeleteUser
