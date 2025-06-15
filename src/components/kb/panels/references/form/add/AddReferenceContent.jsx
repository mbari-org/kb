import { use } from 'react'

import ReferenceForm from '@/components/kb/panels/references/form/ReferenceForm'

import ModalContext from '@/contexts/modal/ModalContext'

const AddReferenceContent = () => {
  const { modalData, setModalData } = use(ModalContext)
  const { reference } = modalData

  const handleChange = updatedReference => {
    setModalData({
      ...modalData,
      reference: updatedReference,
    })
  }

  return <ReferenceForm reference={reference} onChange={handleChange} />
}

export default AddReferenceContent
