import { useCallback, useContext } from 'react'

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

const useDeleteUser = () => {
  const { setModal, setModalData } = useContext(ModalContext)

  return useCallback(
    user => {
      setModal(deleteUserModal())
      setModalData({ user })
    },
    [setModal, setModalData]
  )
}

export default useDeleteUser
