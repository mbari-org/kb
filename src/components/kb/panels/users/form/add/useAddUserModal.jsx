import { use, useCallback } from 'react'

import { createTitle } from '@/components/common/factory/createComponent'

import { createModal } from '@/components/modal/panelModalFactory'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

import AddUserActions from './AddUserActions'
import AddUserContent from './AddUserContent'

const useAddUserModal = () => {
  const { setModal, setModalData } = use(PanelModalContext)

  const showAddUserModal = useCallback(
    (existingUsers = []) => {
      const initialUser = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        isValid: false,
        hasChanges: false,
      }

      setModalData({
        user: initialUser,
        existingUsers,
      })

      const modal = createModal({
        Actions: AddUserActions,
        Content: AddUserContent,
        Title: createTitle({ title: 'Add User' }),
      })

      setModal(modal)
    },
    [setModal, setModalData]
  )

  return showAddUserModal
}

export default useAddUserModal
