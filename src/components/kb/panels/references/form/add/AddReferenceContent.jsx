import { use } from 'react'

import ReferenceForm from '@/components/kb/panels/references/form/ReferenceForm'

import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

const AddReferenceContent = () => {
  const { modalData, setModalData } = use(HOLDModalContext)
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
