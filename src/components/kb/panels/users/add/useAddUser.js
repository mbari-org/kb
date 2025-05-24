import { useCallback, useContext } from 'react'

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

const initialUserData = {
  user: {
    username: '',
    password: '',
    role: '',
    affiliation: '',
    firstName: '',
    lastName: '',
    email: '',
  },
  modified: false,
}

const useAddUser = () => {
  const { setModal, setModalData } = useContext(ModalContext)

  return useCallback(() => {
    setModal(addUserModal())
    setModalData({ ...initialUserData })
  }, [setModal, setModalData])
}

export default useAddUser
