import { use, useCallback } from 'react'

import EditUserActions from './EditUserActions'
import EditUserContent from './EditUserContent'
import EditUserTitle from './EditUserTitle'

import { createModal } from '@/components/modal/factory'

import PanelModalContext from '@/contexts/modal/PanelModalContext'

const editUserModal = editUser => {
  const components = {
    Actions: () => <EditUserActions editUser={editUser} />,
    Content: EditUserContent,
    Title: EditUserTitle,
  }

  return createModal(components)
}

const useEditUserModal = editUser => {
  const { setModal, setModalData } = use(PanelModalContext)

  return useCallback(
    user => {
      setModal(editUserModal(editUser))
      setModalData({
        user: {
          ...user,
          originalUser: user,
          password: '',
          confirmPassword: '',
        },
        modified: false,
      })
    },
    [setModal, setModalData, editUser]
  )
}

export default useEditUserModal
