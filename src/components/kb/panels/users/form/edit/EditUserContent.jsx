import { use } from 'react'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
import UserForm from '../UserForm'

const EditUserContent = () => {
  const { modalData, setModalData } = use(PanelModalContext)
  const { user } = modalData

  const onChange = updatedUser => {
    // Ensure both password fields are always present
    const userData = {
      ...updatedUser,
      password: updatedUser.password || '',
      confirmPassword: updatedUser.confirmPassword || '',
    }
    setModalData({ ...modalData, user: userData })
  }

  const userWithConfirmPassword = {
    ...user,
    password: user.password || '',
    confirmPassword: user.confirmPassword || '',
  }

  return <UserForm user={userWithConfirmPassword} onChange={onChange} isEdit />
}

export default EditUserContent
