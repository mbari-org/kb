import { useCallback, useContext } from 'react'

import LockUserActions from './LockUserActions'
import LockUserContent from './LockUserContent'
import LockUserTitle from './LockUserTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const lockUserModal = () => {
  const components = {
    Actions: LockUserActions,
    Content: LockUserContent,
    Title: LockUserTitle,
  }

  return createModal(components)
}

const useLockUser = () => {
  const { setModal, setModalData } = useContext(ModalContext)

  return useCallback(
    user => {
      setModal(lockUserModal())
      setModalData({ user })
    },
    [setModal, setModalData]
  )
}

export default useLockUser
