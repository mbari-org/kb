import { use } from 'react'

import ReferenceForm from '@/components/kb/panels/references/form/ReferenceForm'

import PanelModalContext from '@/contexts/modal/PanelModalContext'

const AddReferenceContent = () => {
  const { modalData, setModalData } = use(PanelModalContext)
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
