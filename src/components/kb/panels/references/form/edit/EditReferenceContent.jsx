import { use } from 'react'

import ReferenceForm from '@/components/kb/panels/references/form/ReferenceForm'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

const EditReferenceContent = () => {
  const { modalData, setModalData } = use(PanelModalContext)
  const { reference } = modalData

  const handleChange = (updatedReference, modified, hasSearchInput) => {
    setModalData({
      ...modalData,
      reference: updatedReference,
      modified: modified || false,
      hasSearchInput: hasSearchInput || false,
    })
  }

  return <ReferenceForm reference={reference} onChange={handleChange} isEdit={true} />
}

export default EditReferenceContent
