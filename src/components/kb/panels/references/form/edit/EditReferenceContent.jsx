import { use } from 'react'

import ReferenceForm from '@/components/kb/panels/references/form/ReferenceForm'

import ModalContext from '@/contexts/modal/ModalContext'

const EditReferenceContent = ({ isDoiUnique }) => {
  const { modalData, setModalData } = use(ModalContext)
  const { reference } = modalData

  const handleChange = (updatedReference, modified, hasSearchInput) => {
    setModalData({
      ...modalData,
      reference: updatedReference,
      modified: modified || false,
      hasSearchInput: hasSearchInput || false,
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
