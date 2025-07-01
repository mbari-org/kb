import { use } from 'react'

import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'
import UserForm from '../UserForm'

const AddUserContent = () => {
  const { modalData, setModalData } = use(HOLDModalContext)
  const { user, existingUsers } = modalData

  const handleChange = updatedUser => {
    setModalData({
      ...modalData,
      user: updatedUser,
    })
  }

  return (
    <UserForm existingUsers={existingUsers} isEdit={false} onChange={handleChange} user={user} />
  )
}

export default AddUserContent
