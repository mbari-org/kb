import { use } from 'react'
import ReferenceForm from '../ReferenceForm'
import ModalContext from '@/contexts/modal/ModalContext'

const EditReferenceContent = ({ isDoiUnique }) => {
  const { modalData, setModalData } = use(ModalContext)
  const { reference } = modalData

  const handleChange = (updatedReference, modified, hasSearchInput) => {
    setModalData({
      ...modalData,
      reference: updatedReference,
      modified,
      hasSearchInput,
    })
  }

  return (
    <ReferenceForm
      reference={reference}
      onChange={handleChange}
      isDoiUnique={isDoiUnique}
      isEdit={true}
    />
  )
}

export default EditReferenceContent
