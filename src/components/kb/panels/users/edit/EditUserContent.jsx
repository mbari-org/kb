import { use } from 'react'

import ModalContext from '@/contexts/modal/ModalContext'
import UserForm from '../UserForm'

const EditUserContent = () => {
  const { modalData, setModalData } = use(ModalContext)
  const { user } = modalData

  console.log('EditUserContent user:', user)

  const onChange = updatedUser => {
    // Ensure both password fields are always present
    const userData = {
      ...updatedUser,
      password: updatedUser.password || '',
      confirmPassword: updatedUser.confirmPassword || '',
    }
    console.log('EditUserContent userData:', userData)
    setModalData({ ...modalData, user: userData })
  }

  // Ensure confirmPassword is present in the initial user data
  const userWithConfirmPassword = {
    ...user,
    password: user.password || '',
    confirmPassword: user.confirmPassword || '',
  }
  console.log('EditUserContent userWithConfirmPassword:', userWithConfirmPassword)

  return <UserForm user={userWithConfirmPassword} onChange={onChange} isEdit />
}

export default EditUserContent
