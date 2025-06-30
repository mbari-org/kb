import { use } from 'react'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
import UserForm from '../UserForm'

const AddUserContent = () => {
  const { modalData, setModalData } = use(PanelModalContext)
  const { user, existingUsers } = modalData

  const handleChange = updatedUser => {
    setModalData({
      ...modalData,
      user: updatedUser,
    })
  }

  return (
    <div>
      <h3>Add User</h3>
      <UserForm existingUsers={existingUsers} isEdit={false} onChange={handleChange} user={user} />
    </div>
  )
}

export default AddUserContent
