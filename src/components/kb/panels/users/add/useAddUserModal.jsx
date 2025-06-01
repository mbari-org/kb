import { use, useCallback } from 'react'

import AddUserActions from './AddUserActions'
import AddUserContent from './AddUserContent'
import AddUserTitle from './AddUserTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const addUserModal = addUser => {
  const components = {
    Actions: () => <AddUserActions addUser={addUser} />,
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

const useAddUserModal = addUser => {
  const { setModal, setModalData } = use(ModalContext)

  return useCallback(() => {
    setModal(addUserModal(addUser))
    setModalData({ ...initialUserData })
  }, [addUser, setModal, setModalData])
}

export default useAddUserModal
