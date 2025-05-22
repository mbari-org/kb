import { use, useCallback } from 'react'

import AddUserActions from './AddUserActions'
import AddUserContent from './AddUserContent'
import AddUserTitle from './AddUserTitle'

import { createModal } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'

const addUserModal = () => {
  const components = {
    Actions: AddUserActions,
    Content: AddUserContent,
    Title: AddUserTitle,
  }

  return createModal(components)
}

const initialModalData = {
  user: {
    username: '',
    role: '',
    affiliation: '',
    firstName: '',
    lastName: '',
    email: '',
  },
  modified: false,
}

const useAddUser = (onAdd, existingUsers) => {
  const { setModal, setModalData } = use(ModalContext)

  return useCallback(() => {
    const modal = addUserModal()
    const onClose = (modalData, confirmed) => {
      if (confirmed && modalData.modified) {
        onAdd(modalData.user)
      }
      return true
    }
    setModal(modal, onClose)
    setModalData({ ...initialModalData, existingUsers })
  }, [onAdd, setModal, setModalData, existingUsers])
}

export default useAddUser
