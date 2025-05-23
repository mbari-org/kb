import { use } from 'react'

import ModalContext from '@/contexts/modal/ModalContext'
import UserForm from '../UserForm'

const AddUserContent = () => {
  const { modalData, setModalData } = use(ModalContext)
  const { user, existingUsers } = modalData

  const handleChange = updatedUser => {
    setModalData({
      ...modalData,
      user: updatedUser,
    })
  }

  return (
    <UserForm user={user} onChange={handleChange} isEdit={false} existingUsers={existingUsers} />
  )
}

export default AddUserContent
