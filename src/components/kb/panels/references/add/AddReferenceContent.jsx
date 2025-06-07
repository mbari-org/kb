import { use } from 'react'
import ReferenceForm from '../form/ReferenceForm'
import ModalContext from '@/contexts/modal/ModalContext'

const AddReferenceContent = ({ isDoiUnique }) => {
  const { modalData, setModalData } = use(ModalContext)
  const { reference } = modalData

  const handleChange = updatedReference => {
    setModalData({
      ...modalData,
      reference: updatedReference,
    })
  }

  return <ReferenceForm reference={reference} onChange={handleChange} isDoiUnique={isDoiUnique} />
}

export default AddReferenceContent
