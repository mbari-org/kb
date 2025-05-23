import { use } from 'react'

import ModalContext from '@/contexts/modal/ModalContext'
import UserForm from '../UserForm'

const EditUserContent = () => {
  const { modalData, setModalData } = use(ModalContext)
  const { user } = modalData

  const handleChange = updatedUser => {
    setModalData({
      ...modalData,
      user: updatedUser,
    })
  }

  return <UserForm user={user} onChange={handleChange} isEdit={true} />
}

export default EditUserContent
